import { getGeminiModel } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const maxDuration = 30; // Extend serverless function timeout for Gemini API calls

const AI_TIMEOUT_MS = 20000; // 20-second timeout for Gemini responses

export async function POST(request) {
  const useGroq = !!process.env.GROQ_API_KEY;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: max 10 AI parse requests per user per minute
    const { allowed, retryAfter } = checkRateLimit(`ai-parse:${user.id}`, { limit: 10, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${retryAfter} seconds before trying again.` },
        { status: 429 }
      );
    }

    const { jobDescription, compareResume } = await request.json();
    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    // Guard against excessively large inputs to prevent API resource abuse
    if (jobDescription.length > 15000) {
      return NextResponse.json(
        { error: "Job description is too long (max 15,000 characters). Please paste only the relevant details." },
        { status: 400 }
      );
    }

    // Retrieve cached resume text from profile if comparison is requested
    let resumeText = null;
    if (compareResume) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("resume_text")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.warn("Could not retrieve resume text for AI match:", profileError.message);
      } else if (profile?.resume_text) {
        resumeText = profile.resume_text;
      }
    }

    // Construct structured prompt for Gemini
    let prompt = `
      You are an expert AI recruiting assistant. Analyze the following job description and extract structured information.
      Return ONLY a valid JSON object matching the schema below.
      Do NOT include any introductory or concluding text, and do NOT wrap the output in markdown code blocks.
      Ensure all keys are present. Set values to null if not found.

      JSON Schema:
      {
        "company": "string",
        "position": "string",
        "location": "string (format: 'City, State' or 'Remote' or 'Hybrid')",
        "job_type": "one of: full-time, part-time, contract, internship",
        "salary_min": number (minimum salary numerical value as stated in the job description, e.g. 90000 or 150000, or null),
        "salary_max": number (maximum salary numerical value as stated in the job description, e.g. 120000 or 250000, or null),
        "key_requirements": ["string", "string", ...],
        "summary": "A 2-3 sentence summary of the role"
    `;

    if (resumeText) {
      prompt += `,
        "match_score": number (integer between 0 and 100 representing how well the candidate's resume matches this job posting),
        "matching_skills": ["string", "string", ... (skills/tools matching the resume)],
        "missing_skills": ["string", "string", ... (required skills/tools NOT present in the resume)],
        "resume_suggestions": ["string", "string", ... (actionable suggestions to tailor the resume for this position)]
      `;
    }

    prompt += `
      }

      Job Description:
      ${jobDescription}
    `;

    if (resumeText) {
      prompt += `

      Candidate Resume Plaintext:
      ${resumeText}
      `;
    }

    // Call Gemini or Groq with a timeout to prevent indefinite hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS)
    );

    let parsedData = null;

    if (useGroq) {
      const groqPromise = (async () => {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are an expert AI recruiting assistant. You must return only a valid JSON object matching the requested schema. Do not include markdown formatting, backticks, or any conversational text around the JSON.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.1,
            response_format: { type: "json_object" },
          }),
        });

        if (!groqRes.ok) {
          const errText = await groqRes.text();
          throw new Error(`Groq API error: ${groqRes.status} ${errText}`);
        }

        const groqJson = await groqRes.json();
        return groqJson.choices?.[0]?.message?.content;
      })();

      let responseText;
      try {
        responseText = await Promise.race([groqPromise, timeoutPromise]);
      } catch (raceError) {
        if (raceError.message === "AI_TIMEOUT") {
          return NextResponse.json(
            { error: "AI analysis timed out. Please try again with a shorter job description." },
            { status: 504 }
          );
        }
        throw raceError;
      }

      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (parseError) {
        console.error("Failed to parse Groq JSON output:", responseText);
        return NextResponse.json({ error: "Groq did not return valid JSON" }, { status: 502 });
      }
    } else {
      let result;
      try {
        result = await Promise.race([
          getGeminiModel().generateContent(prompt),
          timeoutPromise,
        ]);
      } catch (raceError) {
        if (raceError.message === "AI_TIMEOUT") {
          return NextResponse.json(
            { error: "AI analysis timed out. Please try again with a shorter job description." },
            { status: 504 }
          );
        }
        throw raceError;
      }

      const responseText = result.response.text().trim();

      // Clean potential markdown wrap fences (e.g. ```json ... ```)
      const cleanJson = responseText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

      try {
        parsedData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON output:", responseText);
        return NextResponse.json({ error: "Gemini did not return valid JSON" }, { status: 502 });
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("AI Parser route handler error:", error);
    
    let userMessage = "Failed to analyze the job description. Please try again.";
    const errMsg = error.message || "";
    
    if (useGroq) {
      if (
        errMsg.includes("429") || 
        errMsg.toLowerCase().includes("rate limit") ||
        errMsg.toLowerCase().includes("quota")
      ) {
        userMessage = "Groq AI service rate limit reached. Please wait a few seconds before trying again, or check your rate limits in the Groq Console.";
      } else if (
        errMsg.includes("401") ||
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("unauthorized")
      ) {
        userMessage = "Groq configuration error. The server's Groq API key is invalid or unauthorized.";
      } else if (
        errMsg.includes("503") || 
        errMsg.toLowerCase().includes("overloaded") || 
        errMsg.toLowerCase().includes("service unavailable")
      ) {
        userMessage = "Groq AI servers are currently overloaded. Please try again in a moment.";
      }
    } else {
      if (errMsg.includes("limit: 0")) {
        userMessage = "AI quota limit is 0. This usually means your Gemini API Key or Google Cloud project is restricted, needs billing setup, or is not available in your region. Please verify your API key and limits in Google AI Studio.";
      } else if (
        errMsg.includes("429") || 
        errMsg.toLowerCase().includes("quota exceeded") || 
        errMsg.toLowerCase().includes("rate limit")
      ) {
        userMessage = "Google Gemini AI service rate limit reached. Please wait a few seconds before trying again.";
      } else if (
        errMsg.includes("API_KEY_INVALID") || 
        errMsg.toLowerCase().includes("api key not valid")
      ) {
        userMessage = "Google Gemini configuration error. The server's API key is invalid or unauthorized.";
      } else if (
        errMsg.includes("503") || 
        errMsg.toLowerCase().includes("overloaded") || 
        errMsg.toLowerCase().includes("service unavailable")
      ) {
        userMessage = "Google Gemini servers are currently overloaded. Please try again in a moment.";
      }
    }
    
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
