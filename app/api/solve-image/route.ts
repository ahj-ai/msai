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

CRITICALLY IMPORTANT: You MUST respond with a single minified JSON object. Do not include any text or markdown formatting outside of the JSON object. The JSON object must have the following structure:
{
  "problem": {
    "title": "A brief title identifying the type of problem (e.g., 'Differentiation of a Polynomial').",
    "statement": "Restate the user's question clearly based on the image content. Use LaTeX for all mathematical components.",
    "keyConcepts": ["A list of key concepts or formulas needed (e.g., 'The Power Rule')."]
  },
  "solution": [
    {
      "step": "State the action being taken for this step (e.g., 'Differentiate the first term').",
      "work": "Show all mathematical work and calculations for this step, using LaTeX.",
      "explanation": "Provide a concise explanation of the reasoning or rule being applied."
    }
  ],
  "answer": {
    "finalResult": "State the final, simplified result, using LaTeX.",
    "verification": "Include a brief section on how the answer could be verified, using LaTeX."
  }
}

Core Directives:
- ALL mathematical components—including variables (e.g., $x$), numbers, functions, and equations—MUST be rendered using LaTeX.
- Use single dollar signs ($...$) for inline LaTeX.
- Use double dollar signs ($$...$$) for block-level or display LaTeX equations.
- Be thorough in your explanations, but avoid unnecessary jargon. Assume the user is intelligent but may be new to the concept.
- If the image is unclear or you cannot confidently interpret the problem, the JSON response should indicate this clearly, perhaps in the 'problem.statement' or by returning an appropriate error structure within the JSON.`;

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
