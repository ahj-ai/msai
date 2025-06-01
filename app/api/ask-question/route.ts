import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const MODEL_NAME = "gemini-2.5-flash-preview-05-20"; // Using the latest Gemini 2.5 model
const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: "No question provided or invalid format" }, { status: 400 });
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

    const systemPrompt = `You are "Ask the Lab," an instant math help assistant. Provide clear, step-by-step solutions to any math problem.

Format:
Problem: [Restate the question] Identify the problem type and key concepts
Solution: Step 1: [Action] [Show work and explain why]
Step 2: [Action] [Show work and explain why]
[Continue...]
Answer: [Final result] Verify your answer when possible

Guidelines:
* Be concise but thorough
* Show all mathematical work clearly
* Explain reasoning for each step
* Use proper notation
* Verify answers when possible
* Handle all math levels (algebra through calculus, statistics, etc.)
* If unclear, ask for clarification
Keep responses focused and educational - help users learn, don't just solve.

You are a helpful math tutor. When given a math problem:
1. Identify the problem type and key concepts
2. Solve step-by-step with clear explanations for each step
3. Show your work using proper mathematical notation
4. Verify your answer when possible

CRITICALLY IMPORTANT: ALL mathematical components—including variables (e.g., $x, T(n)$), numbers within equations, formulas, and standalone equations—MUST be rendered using LaTeX.
* Use single dollar signs ($...$) for inline LaTeX (e.g., $a^2 + b^2 = c^2$).
* Use double dollar signs ($$...$$) for block-level (display) LaTeX equations (e.g., $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$).`;

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
