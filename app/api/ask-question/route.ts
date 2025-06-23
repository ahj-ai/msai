import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { OPERATION_COSTS } from '@/lib/constants';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MODEL_NAME = "gemini-1.5-pro"; // Use a model compatible with the ENUM 'gemini-1.5-pro' or 'gemini-1.5-flash'
const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userId: string | null = null;
  let promptForLogging: string | null = null;
  let responseForLogging: any = null;
  let statusCodeForLogging: number = 500; // Default to 500 Internal Server Error
  let errorMessageForLogging: string | null = null;
  let requestTokens: number | undefined = undefined;
  let responseTokens: number | undefined = undefined;
  let finalResponse: NextResponse | null = null;

  try {
    if (!API_KEY) {
      errorMessageForLogging = "API key not configured";
      statusCodeForLogging = 500;
      return NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }

    const auth = getAuth(req);
    userId = auth.userId;
    
    if (!userId) {
      errorMessageForLogging = "Unauthorized";
      statusCodeForLogging = 401;
      return NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }
    
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      errorMessageForLogging = "No question provided or invalid format";
      statusCodeForLogging = 400;
      return NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }
    
    const stackCost = OPERATION_COSTS.ASK_QUESTION;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemPrompt = `You are "Ask the Lab," an expert math tutor and instant help assistant. Your primary goal is to provide clear, engaging, and educational step-by-step solutions to help users learn concepts, not just get an answer.\n\nCRITICALLY IMPORTANT: You MUST respond with a single minified JSON object. Do not include any text or markdown formatting outside of the JSON object. The JSON object must have the following structure:\n{\n  "problem": {\n    "title": "A brief title identifying the type of problem (e.g., 'Differentiation of a Polynomial').",\n    "statement": "Restate the user's question clearly. Use LaTeX for all mathematical components.",\n    "keyConcepts": ["A list of key concepts or formulas needed (e.g., 'The Power Rule')."]\n  },\n  "solution": [\n    {\n      "step": "State the action being taken for this step (e.g., 'Differentiate the first term').",\n      "work": "Show all mathematical work and calculations for this step, using LaTeX.",\n      "explanation": "Provide a concise explanation of the reasoning or rule being applied."
    }\n  ],\n  "answer": {\n    "finalResult": "State the final, simplified result, using LaTeX.",\n    "verification": "Include a brief section on how the answer could be verified, using LaTeX."
  }\n}\n\nCore Directives:\n- ALL mathematical components—including variables (e.g., $x$), numbers, functions, and equations—MUST be rendered using LaTeX.\n- Use single dollar signs ($...$) for inline LaTeX.\n- Use double dollar signs ($$...$$) for block-level or display LaTeX equations.\n- Be thorough in your explanations, but avoid unnecessary jargon. Assume the user is intelligent but may be new to the concept.\n`;

    promptForLogging = `System Prompt: ${systemPrompt}\n\nQuestion: ${question}`;

    const parts = [
      { text: systemPrompt },
      { text: `Question: ${question}` }
    ];

    const geminiResult = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    
    const usageMetadata = geminiResult.response.usageMetadata;
    if (usageMetadata) {
        requestTokens = usageMetadata.promptTokenCount;
        responseTokens = usageMetadata.candidatesTokenCount;
    }

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
      errorMessageForLogging = spendData.error || "Failed to process stacks";
      statusCodeForLogging = spendResponse.status;
      if (spendResponse.status === 402 || spendData.code === 'INSUFFICIENT_STACKS') {
        finalResponse = NextResponse.json({ ...spendData, error: "Insufficient stacks" }, { status: 402 });
      } else {
        finalResponse = NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
      }
      return finalResponse;
    }

    let responseText = geminiResult.response.text();
    const jsonCodeBlockRegex = /```json\s*([\s\S]*?)```/;
    const match = responseText.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      responseText = match[1].trim();
    }
    
    try {
      const parsedAnswer = JSON.parse(responseText);
      responseForLogging = parsedAnswer;
      statusCodeForLogging = 200;
      finalResponse = NextResponse.json({ answer: parsedAnswer });
    } catch (parseError) {
      errorMessageForLogging = "The AI returned a response in an unexpected format.";
      responseForLogging = { raw: responseText }; // Log the raw response on parse failure
      statusCodeForLogging = 500;
      finalResponse = NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }

    return finalResponse;

  } catch (error: any) {
    console.error("Error in ask-question route:", error);
    errorMessageForLogging = error.message || "An unknown error occurred.";
    statusCodeForLogging = error.status || 500;
    finalResponse = NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    return finalResponse;
  } finally {
    const latencyMs = Date.now() - startTime;
    
    const { error: logError } = await supabaseAdmin.from('gemini_api_logs').insert({
        user_id: userId,
        product: 'ask_the_lab',
        model_used: 'gemini-1.5-pro',
        prompt: promptForLogging,
        response: responseForLogging,
        status_code: statusCodeForLogging,
        error_message: errorMessageForLogging,
        latency_ms: latencyMs,
        request_tokens: requestTokens,
        response_tokens: responseTokens,
    });

    if (logError) {
      console.error("Failed to log Gemini API call to Supabase:", logError);
    }
  }
}
