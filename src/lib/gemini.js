import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable. Please add it to your .env.local file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Pre-initialized Gemini 2.0 Flash model instance.
 * Import this in server-side API routes only — never in client components.
 * 
 * Usage:
 *   import { geminiModel } from "@/lib/gemini";
 *   const result = await geminiModel.generateContent(prompt);
 *   const text = result.response.text();
 */
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
