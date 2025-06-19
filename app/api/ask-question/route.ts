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

    // Call Gemini API first, only debit stacks if successful
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

    const systemPrompt = `You are "Ask the Lab," an expert math tutor and instant help assistant. Your primary goal is to provide clear, engaging, and educational step-by-step solutions to help users learn concepts, not just get an answer.

CRITICALLY IMPORTANT: You MUST respond with a single minified JSON object. Do not include any text or markdown formatting outside of the JSON object. The JSON object must have the following structure:
{
  "problem": {
    "title": "A brief title identifying the type of problem (e.g., 'Differentiation of a Polynomial').",
    "statement": "Restate the user's question clearly. Use LaTeX for all mathematical components.",
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
`;

    const parts = [
      {
        text: systemPrompt
      },
      {
        text: `Question: ${question}`
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
      console.error("Error processing question with Gemini API:", error);
      let errorMessage = "Failed to process question.";
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
          amount: stackCost,
          operation: 'ASK_QUESTION',
          description: `Ask the Lab question: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`
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
            required: stackCost
          }, { status: 402 });
        }
        
        // Handle other errors
        return NextResponse.json({
          error: spendData.error || "Failed to process stacks for this operation"
        }, { status: spendResponse.status });
      }
      
      console.log(`Successfully spent ${stackCost} stacks for ASK_QUESTION operation. Remaining: ${spendData.remainingStacks}`);
    } catch (stacksError) {
      console.error("Error spending stacks:", stacksError);
      return NextResponse.json({ error: "Failed to process stacks for this operation" }, { status: 500 });
    }

    let responseText = geminiResult.response.text();
    
    try {
      // Check if response is wrapped in code blocks (```json ... ```)
      const jsonCodeBlockRegex = /```json\s*([\s\S]*?)```/;
      const match = responseText.match(jsonCodeBlockRegex);
      
      if (match && match[1]) {
        // Extract just the JSON part from within the code blocks
        responseText = match[1].trim();
      }
      
      // Parse the JSON response
      const parsedAnswer = JSON.parse(responseText);
      return NextResponse.json({ answer: parsedAnswer });
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON. Raw response:", responseText, "Error:", parseError);
      return NextResponse.json({ error: "The AI returned a response in an unexpected format that could not be processed. Please try asking your question again." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing question with Gemini API:", error);
    let errorMessage = "Failed to process question.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
