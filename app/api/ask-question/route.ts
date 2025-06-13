import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { OPERATION_COSTS } from '@/lib/constants';

const MODEL_NAME = "gemini-2.5-flash-preview-05-20"; // Using the latest Gemini 2.5 model
const API_KEY = process.env.GEMINI_API_KEY || "";

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
    
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: "No question provided or invalid format" }, { status: 400 });
    }
    
    // Cost for asking a question
    const stackCost = OPERATION_COSTS.ASK_QUESTION;
    
    // Debit stacks from the user account
    try {
      const token = await req.headers.get('authorization')?.split(' ')[1];
      const spendResponse = await fetch(new URL('/api/user/stacks', req.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: stackCost,
          operation: 'ASK_QUESTION'
        })
      });
      
      const spendData = await spendResponse.json();
      
      if (!spendResponse.ok) {
        // If there's an insufficient stacks error, inform the user
        if (spendData.code === 'INSUFFICIENT_STACKS') {
          return NextResponse.json({
            error: "Insufficient stacks to perform this operation",
            code: "INSUFFICIENT_STACKS",
            available: spendData.available,
            required: stackCost
          }, { status: 400 });
        }
        
        // Handle other errors
        return NextResponse.json({
          error: spendData.error || "Failed to process stacks for this operation"
        }, { status: spendResponse.status });
      }
      
      console.log(`Successfully spent ${stackCost} stacks for ASK_QUESTION operation`);
    } catch (stacksError) {
      console.error("Error spending stacks:", stacksError);
      return NextResponse.json({ error: "Failed to process stacks for this operation" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 8192,
    };

    // Safety settings
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemPrompt = `You are "Ask the Lab," an expert math tutor and instant help assistant. Your primary goal is to provide clear, engaging, and educational step-by-step solutions to help users learn concepts, not just get an answer. You are patient, thorough, and an expert in all levels of mathematics.

## Output Structure and Formatting

You must format the entire response in Markdown. Follow this precise structure using level 3 headings (###) for each section:

### Problem
- Restate the user's question clearly.
- Identify the type of problem (e.g., "Differentiation of a Polynomial," "Solving a System of Linear Equations").
- List the key concepts or formulas that will be necessary for the solution (e.g., "The Power Rule," "The Quadratic Formula").

### Step-By-Step Solution
Present the main solution using numbered steps (1., 2., etc.).
For each step, you must:
- State the action being taken (e.g., "Differentiate the first term").
- Show all mathematical work and calculations clearly.
- Provide a concise explanation of the reasoning or the specific rule being applied for that calculation.

### Answer
- State the final, simplified result in a clear and distinct manner.
- When possible, include a brief section on how the answer could be verified.

## Core Directives and Constraints

These rules must be followed at all times:

### CRITICALLY IMPORTANT: LaTeX Formatting

- ALL mathematical components—including variables (e.g., $x$, $T(n)$), numbers, functions, formulas, and standalone equations—MUST be rendered using LaTeX.
- Use single dollar signs ($...$) for inline LaTeX (e.g., The function is $f(x) = 2x^2$).
- Use double dollar signs ($$...$$) for block-level or display LaTeX equations (e.g., the derivative is found using the Power Rule, $$\frac{d}{dx}(x^n) = nx^{n-1}$$).

### Additional Guidelines

- **Clarity and Conciseness**: Be thorough in your explanations, but avoid unnecessary jargon or overly long paragraphs. Keep the focus educational.
- **Audience**: Assume the user is intelligent but may be seeing this concept for the first time. Do not skip crucial steps.
- **Interaction**: If the user's request is ambiguous or seems incomplete, ask for clarification before attempting a solution.`;

    const parts = [
      {
        text: systemPrompt
      },
      {
        text: `Question: ${question}`
      }
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    return NextResponse.json({ answer: responseText });

  } catch (error) {
    console.error("Error processing question with Gemini API:", error);
    let errorMessage = "Failed to process question.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
