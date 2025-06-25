import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { OPERATION_COSTS } from '@/lib/constants';
import { createClient } from '@supabase/supabase-js';
import { solutionSchema } from '@/lib/schemas';

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MODEL_NAME = "gemini-2.5-flash";
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
    
    const { originalProblem } = await req.json();

    if (!originalProblem || typeof originalProblem !== 'object') {
      errorMessageForLogging = "No problem data provided or invalid format";
      statusCodeForLogging = 400;
      return NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    }
    
    // The cost for generating a similar problem
    const stackCost = OPERATION_COSTS.GENERATE_SIMILAR;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: solutionSchema,
            temperature: 0.7, // Slightly higher temperature for more variation
            topK: 32,
            topP: 1,
            maxOutputTokens: 8192,
        },
    });

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemPrompt = `You are a math problem generator tasked with creating new math problems similar to provided examples. 

Core Directives:
- Create a NEW math problem that is STRUCTURALLY SIMILAR but with DIFFERENT numbers, variables, or contexts compared to the provided problem.
- The new problem should have the same difficulty level and apply the same mathematical concepts.
- ALL mathematical components—including variables (e.g., $x$), numbers, functions, and equations—MUST be rendered using LaTeX.
- Use single dollar signs ($...$) for inline LaTeX. For example, '$x^2 + 3x + 2$'.
- Use double dollar signs ($$...$$) for block-level or display LaTeX equations. For example, '$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$'.
- CRITICAL: Every mathematical expression MUST be enclosed in EXACTLY ONE pair of LaTeX delimiters.
- Follow the EXACT SAME FORMAT as the provided problem, including the problem structure, step-by-step solution approach, key concepts, and verification methods.
- You MUST return your response as a valid JSON object matching the EXACT structure of the provided problem with problem, solution, and answer fields.
- IMPORTANT: Make sure your response is PURE JSON, with no explanation text before or after. The output must be valid parsable JSON.`;

    // Extract the title or subject from the original problem to reference in the prompt
    const originalTitle = originalProblem.problem?.title || "math problem";
    
    promptForLogging = `System Prompt: ${systemPrompt}\n\nOriginal Problem: ${JSON.stringify(originalProblem)}`;

    const parts = [
      { text: systemPrompt },
      { text: `I want you to generate a new math problem that is structurally similar to this one, but with different numbers and slightly different context. Make sure it applies the same mathematical concepts and has a similar solution approach.\n\nOriginal Problem: ${JSON.stringify(originalProblem, null, 2)}` }
    ];

    const geminiResult = await model.generateContent({
      contents: [{ role: "user", parts }],
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
        operation: 'GENERATE_SIMILAR',
        description: `Generated similar problem to: "${originalTitle.substring(0, 50)}${originalTitle.length > 50 ? '...' : ''}"`
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

    const responseText = geminiResult.response.text();
    console.log('Raw Gemini response:', responseText);

    try {
      // Try to clean up the response if needed
      let cleanResponse = responseText.trim();
      
      // Remove any markdown code block indicators if present
      if (cleanResponse.startsWith("```json")) {
        cleanResponse = cleanResponse.replace(/```json\s*/, "");
      }
      if (cleanResponse.endsWith("```")) {
        cleanResponse = cleanResponse.replace(/\s*```$/, "");
      }
      
      // Check if response starts and ends with curly braces (indicating JSON)
      if (!cleanResponse.startsWith('{') || !cleanResponse.endsWith('}')) {
        throw new Error('Response is not in proper JSON format');
      }
      
      const parsedAnswer = JSON.parse(cleanResponse);
      
      // Validate the expected structure
      if (!parsedAnswer.problem || !parsedAnswer.solution || !parsedAnswer.answer) {
        throw new Error('Response missing required fields (problem, solution, or answer)');
      }
      
      responseForLogging = parsedAnswer;
      statusCodeForLogging = 200;
      finalResponse = NextResponse.json({ answer: parsedAnswer });
    } catch (parseError) {
      console.error('Parse error:', parseError);
      if (parseError instanceof Error) {
        errorMessageForLogging = `The AI returned a response that could not be parsed: ${parseError.message}`;
      } else {
        errorMessageForLogging = `The AI returned a response that could not be parsed: ${String(parseError)}`;
      }
      responseForLogging = { raw: responseText };
      statusCodeForLogging = 500;
      finalResponse = NextResponse.json({ 
        error: errorMessageForLogging, 
        rawResponse: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '') 
      }, { status: statusCodeForLogging });
    }

    return finalResponse;

  } catch (error: any) {
    console.error("Error in generate-similar-problem route:", error);
    errorMessageForLogging = error.message || "An unknown error occurred.";
    statusCodeForLogging = error.status || 500;
    finalResponse = NextResponse.json({ error: errorMessageForLogging }, { status: statusCodeForLogging });
    return finalResponse;
  } finally {
    const latencyMs = Date.now() - startTime;
    
    const { error: logError } = await supabaseAdmin.from('gemini_api_logs').insert({
        user_id: userId,
        product: 'ask_the_lab', // Using existing product type for compatibility with Supabase enum
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
