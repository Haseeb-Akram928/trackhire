import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse-new";

export const maxDuration = 30; // Extend serverless function timeout for PDF parsing

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: max 5 resume uploads per user per minute
    const { allowed, retryAfter } = checkRateLimit(`resume-upload:${user.id}`, { limit: 5, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many upload attempts. Please wait ${retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    // Convert file object to ArrayBuffer and Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract raw text using pdf-parse-new
    let resumeText = "";
    try {
      const parsedPdf = await pdfParse(buffer);
      resumeText = parsedPdf.text.trim();
    } catch (parseError) {
      console.error("PDF text extraction failed:", parseError);
      return NextResponse.json({ error: "Failed to extract text from PDF resume" }, { status: 400 });
    }

    if (!resumeText) {
      return NextResponse.json({ error: "Extracted resume content is empty" }, { status: 400 });
    }

    // Define target path (enforces user partitioning in Storage resumes bucket)
    const filePath = `${user.id}/resume.pdf`;

    // Upload PDF to Supabase Storage resumes bucket
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
    }

    // Update profiles table with resume path and text
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        resume_url: filePath,
        resume_text: resumeText,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`Failed to update profile database record: ${profileError.message}`);
    }

    return NextResponse.json({
      success: true,
      resumeUrl: filePath,
      message: "Resume uploaded and processed successfully",
    });
  } catch (error) {
    console.error("Resume upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to process resume upload" }, { status: 500 });
  }
}
