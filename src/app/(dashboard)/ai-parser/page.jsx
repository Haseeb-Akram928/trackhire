import React from "react";
import { JobParser } from "@/features/ai-parser/JobParser/JobParser";
import styles from "./AiParserPage.module.css";

export const metadata = {
  title: "AI Job Parser & Matcher | TrackHire",
  description: "Extract job details from descriptions and match against your resume qualifications using Google Gemini.",
};

export default function AiParserPage() {
  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>AI Job Parser & Matcher</h1>
        <p className={styles.subtitle}>
          Paste any job description and let Google Gemini extract position details, salaries, and calculate your resume match score.
        </p>
      </header>

      <JobParser />
    </div>
  );
}
