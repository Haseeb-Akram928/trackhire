import { GoogleGenerativeAI } from "@google/generative-ai";

let _model = null;

/**
 * Lazily initializes and returns the Gemini 2.0 Flash model instance.
 *
 * Unlike eagerly throwing at module import time, this defers the API key
 * check to the first actual request — so missing GEMINI_API_KEY won't crash
 * unrelated routes that transitively import this module.
 *
 * Usage (server-side API routes only):
 *   import { getGeminiModel } from "@/lib/gemini";
 *   const model = getGeminiModel();
 *   const result = await model.generateContent(prompt);
 */
export function getGeminiModel() {
  if (!_model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing GEMINI_API_KEY environment variable. Please add it to your .env.local file."
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    _model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return _model;
}
