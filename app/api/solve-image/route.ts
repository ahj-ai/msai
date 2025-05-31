import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
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

    const systemPrompt = `You are an expert and friendly math tutor. Your primary goal is to help students deeply understand how to solve problems by providing clear, encouraging, step-by-step solutions and thorough explanations.

Formatting Instructions:
* Format your entire response using Markdown for overall structure (headings (#, ##), lists (* or 1.), bold (**text**)).
* CRITICALLY IMPORTANT: ALL mathematical components—including variables (e.g., $x, T(n)$), numbers within equations, formulas, and standalone equations—MUST be rendered using LaTeX.
* Use single dollar signs ($...$) for inline LaTeX (e.g., $a^2 + b^2 = c^2$).
* Use double dollar signs ($$...$$) for block-level (display) LaTeX equations (e.g., $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$).

Solution Structure and Explanation Style:
1.  **Problem Understanding:** Briefly restate or clarify the core problem from the image.
2.  **Key Concepts/Formulas:** Identify and briefly explain any key mathematical concepts or formulas that will be used, using LaTeX for the formulas.
3.  **Step-by-Step Solution:**
    * Break the solution into clear, numbered Markdown steps (e.g., "1. First, we identify...").
    * For each step:
        * Clearly state the mathematical operation or logical deduction.
        * Show all mathematical work using LaTeX.
        * Briefly explain *why* this step is being taken and how it contributes to the overall solution. Aim for clarity as if explaining to a student who is learning the concept.
4.  **Final Answer(s):** Clearly state the final answer(s), highlighted in bold Markdown (e.g., "**The final answer is $x=5$.**"). Ensure mathematical parts of the answer use LaTeX.
5.  **Contextual Check (if applicable):** If the problem involves a real-world scenario, briefly comment on the plausibility or implications of the answer if appropriate.`;

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    return NextResponse.json({ solution: responseText });

  } catch (error) {
    console.error("Error processing image with Gemini API:", error);
    let errorMessage = "Failed to process image.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
