import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { OPERATION_COSTS } from '@/lib/constants';

const MODEL_NAME = "gemini-2.5-flash-preview-05-20"; // Using the latest Gemini 2.5 model
const API_KEY = process.env.GEMINI_API_KEY || "";

// Helper function to convert a ReadableStream to a base64 string
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    // Authenticate the user using Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }
    
    // Convert the image file to the format Gemini API expects (base64 string and mimeType)
    const imageBuffer = await streamToBuffer(imageFile.stream());
    const imageBase64 = imageBuffer.toString("base64");
    const mimeType = imageFile.type;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4, // Adjust as needed
      topK: 32,
      topP: 1,
      maxOutputTokens: 8192, // Adjust as needed
    };

    // Safety settings - adjust as needed
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemPrompt = `You are "Screenshot & Solve," an expert math tutor and instant help assistant. Your primary goal is to provide clear, engaging, and educational step-by-step solutions to help users learn concepts, not just get an answer. You are patient, thorough, and an expert in all levels of mathematics.

## Output Structure and Formatting

You must format the entire response in Markdown. Follow this precise structure using level 3 headings (###) for each section:

### Problem
- Restate the user's question clearly based on the image content.
- Identify the type of problem (e.g., "Differentiation of a Polynomial," "Solving a System of Linear Equations").
- List the key concepts or formulas that will be necessary for the solution (e.g., "The Power Rule," "The Quadratic Formula").

### Step-By-Step Solution
- Present the main solution using numbered steps (1., 2., etc.).
- For each step, you must:
  - State the action being taken (e.g., "Differentiate the first term").
  - Show all mathematical work and calculations clearly.
  - Provide a concise explanation of the reasoning or the specific rule being applied for that calculation.
- Make sure your solution is complete and educational.

### Answer
- State the final, simplified result in a clear and distinct manner.
- When possible, include a brief section on how the answer could be verified.
- Make sure the answer is highlighted or emphasized for clarity.

## Core Directives and Constraints

These rules must be followed at all times:

### CRITICALLY IMPORTANT: LaTeX Formatting

- ALL mathematical components—including variables (e.g., $x$, $T(n)$), numbers, functions, formulas, and standalone equations—MUST be rendered using LaTeX.
- Use single dollar signs ($...$) for inline LaTeX (e.g., The function is $f(x) = 2x^2$).
- Use double dollar signs ($$...$$) for block-level or display LaTeX equations (e.g., the derivative is found using the Power Rule, $$\frac{d}{dx}(x^n) = nx^{n-1}$$).

### Additional Guidelines

- **Clarity and Conciseness**: Be thorough in your explanations, but avoid unnecessary jargon or overly long paragraphs. Keep the focus educational.
- **Audience**: Assume the user is intelligent but may be seeing this concept for the first time. Do not skip crucial steps.
- **Interaction**: If the image is unclear or you cannot confidently interpret the problem, indicate this and explain what you can see.`;

    const parts = [
      {
        text: systemPrompt
      },
      {
        text: "Your Task:\nHelp me solve the following math problem. I have attached an image of it. Please provide a detailed step-by-step solution and explanation according to the guidelines above."
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      }
    ];

    let geminiResult;
    try {
      geminiResult = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
    } catch (error) {
      console.error("Error processing image with Gemini API:", error);
      let errorMessage = "Failed to process image.";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Only debit stacks if Gemini succeeded
    try {
      const authHeader = req.headers.get('authorization');
      const spendResponse = await fetch(new URL('/api/user/stacks', req.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader || ''
        },
        body: JSON.stringify({
          amount: OPERATION_COSTS.SOLVE_IMAGE,
          operation: 'SOLVE_IMAGE',
          description: `Snap and Solve image: ${imageFile.name || 'untitled'}`
        })
      });
      
      const spendData = await spendResponse.json();
      
      if (!spendResponse.ok) {
        // If there's an insufficient stacks error, inform the user
        if (spendResponse.status === 402 || spendData.code === 'INSUFFICIENT_STACKS') {
          return NextResponse.json({
            error: "Insufficient stacks to perform this operation",
            code: "INSUFFICIENT_STACKS",
            available: spendData.available,
            required: OPERATION_COSTS.SOLVE_IMAGE
          }, { status: 402 });
        }
        // Handle other errors
        return NextResponse.json({
          error: spendData.error || "Failed to process stacks for this operation"
        }, { status: spendResponse.status });
      }
      console.log(`Successfully spent ${OPERATION_COSTS.SOLVE_IMAGE} stacks for SOLVE_IMAGE operation. Remaining: ${spendData.remainingStacks}`);
    } catch (stacksError) {
      console.error("Error spending stacks:", stacksError);
      return NextResponse.json({ error: "Failed to process stacks for this operation" }, { status: 500 });
    }

    const responseText = geminiResult.response.text();
    return NextResponse.json({ solution: responseText });

  } catch (error) {
    console.error("Error in solve-image endpoint:", error);
    let errorMessage = "Failed to process image.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
