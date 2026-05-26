import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "TrackHire | AI-Powered Job Application Tracker & Pipeline",
  description: "Track your job applications, visualize your hiring pipeline with a Kanban board, upload resumes for AI parsing, and matching qualifications using Google Gemini.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(220, 33%, 14%)",
              color: "hsl(210, 40%, 98%)",
              border: "1px solid hsl(215, 28%, 18%)",
              borderRadius: "10px",
              fontSize: "0.9rem",
            },
            success: {
              iconTheme: {
                primary: "hsl(142, 71%, 45%)",
                secondary: "hsl(220, 33%, 14%)",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(0, 84%, 60%)",
                secondary: "hsl(220, 33%, 14%)",
              },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
