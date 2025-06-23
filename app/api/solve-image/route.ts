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

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY || "";

// Helper function to convert a ReadableStream to a Buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userId: string | null = null;
  let promptForLogging: string | null = null;
  let responseForLogging: any = null;
  let statusCodeForLogging: number = 500;
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

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      errorMessageForLogging = "No image file provided";
      statusCodeForLogging = 400;
      return NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }

    const imageBuffer = await streamToBuffer(imageFile.stream());
    const imageBase64 = imageBuffer.toString("base64");
    const mimeType = imageFile.type;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = { temperature: 0.4, topK: 32, topP: 1, maxOutputTokens: 8192 };
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemPrompt = `You are "Snap & Solve," an expert math tutor. Your goal is to analyze an image of a math problem and provide a clear, step-by-step solution.

CRITICALLY IMPORTANT: You MUST respond with a single, minified JSON object. Do not use markdown or any text outside the JSON.
The JSON object must follow this exact structure:
{
  "problem": {
    "title": "A brief title identifying the type of problem (e.g., 'Solving a Quadratic Equation').",
    "statement": "Restate the user's question clearly based on the image content. Use LaTeX for all mathematical components.",
    "keyConcepts": ["A list of key concepts or formulas needed (e.g., 'Quadratic Formula')."]
  },
  "solution": [
    {
      "step": "State the action for this step (e.g., 'Identify coefficients a, b, and c').",
      "work": "Show all mathematical work for this step, using LaTeX.",
      "explanation": "Explain the reasoning or rule being applied."
    }
  ],
  "answer": {
    "finalResult": "State the final, simplified result, using LaTeX.",
    "verification": "Briefly explain how the answer could be verified."
  }
}

ALL mathematical expressions MUST be valid LaTeX, enclosed in single ($) or double ($$) dollar signs. If the image is unclear or unreadable, state that clearly in the 'problem.statement' and do not attempt a solution.`;

    promptForLogging = `System Prompt: ${systemPrompt}\n\nUser Task: Help me solve the math problem in the attached image (${imageFile.name}, ${mimeType}).`;

    const parts = [
      { text: systemPrompt },
      { text: "Your Task: Help me solve the math problem in the attached image." },
      { inlineData: { mimeType, data: imageBase64 } }
    ];

    const geminiResult = await model.generateContent({ contents: [{ role: "user", parts }], generationConfig, safetySettings });

    const usageMetadata = geminiResult.response.usageMetadata;
    if (usageMetadata) {
        requestTokens = usageMetadata.promptTokenCount;
        responseTokens = usageMetadata.candidatesTokenCount;
    }

    const authHeader = req.headers.get('authorization');
    const spendResponse = await fetch(new URL('/api/user/stacks', req.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader || '' },
      body: JSON.stringify({
        amount: OPERATION_COSTS.SOLVE_IMAGE,
        operation: 'SOLVE_IMAGE',
        description: `Snap and Solve image: ${imageFile.name || 'untitled'}`
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
      const solutionJson = JSON.parse(responseText);
      responseForLogging = solutionJson;
      statusCodeForLogging = 200;
      finalResponse = NextResponse.json({ answer: solutionJson });
    } catch (parseError) {
      errorMessageForLogging = "The AI returned a response in an unexpected format.";
      responseForLogging = { raw: responseText };
      statusCodeForLogging = 500;
      finalResponse = NextResponse.json({ error: responseText }); // Still return raw text to client on parse error
    }

    return finalResponse;

  } catch (error: any) {
    console.error("Error in solve-image route:", error);
    errorMessageForLogging = error.message || "An unknown error occurred.";
    statusCodeForLogging = error.status || 500;
    finalResponse = NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    return finalResponse;
  } finally {
    const latencyMs = Date.now() - startTime;

    const { error: logError } = await supabaseAdmin.from('gemini_api_logs').insert({
      user_id: userId,
      product: 'snap_and_solve',
      model_used: MODEL_NAME,
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
