import { NextResponse } from "next/server";

export async function GET() {
  const provider = process.env.GROQ_API_KEY
    ? "Groq (Llama 3.3 70B)"
    : "Google Gemini 2.0 Flash";
  return NextResponse.json({ provider });
}
