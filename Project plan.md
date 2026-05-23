# 🎯 TrackHire — Complete Architecture

A full-stack Next.js + Supabase productivity app that helps job seekers track applications, visualize their pipeline, upload resumes for automated parsing, and leverage AI to compare their qualifications and extract job details automatically.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR, Server Actions, API routes, file-based routing |
| **Language** | JavaScript (no TypeScript) | Matches your current skill set, faster dev speed |
| **Auth** | Supabase Auth (`@supabase/ssr`) | Cookie-based SSR auth, Google OAuth, email/password |
| **Database** | Supabase (PostgreSQL) | RLS, real-time, free tier |
| **AI** | Google Gemini API (`@google/generative-ai`) | Free tier — gemini-2.0-flash model |
| **PDF Parsing** | `pdf-parse` | Extractor for raw text from uploaded resumes (server-side) |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | Kanban board |
| **Charts** | `recharts` | Analytics dashboard |
| **Styling** | CSS Modules | Scoped, no build config, you already know it |
| **Notifications** | `react-hot-toast` | Toasts for user feedback |
| **Date Handling** | `date-fns` | Formatting dates |
| **Icons** | `lucide-react` | Consistent icon set |
| **Deployment** | Vercel | Zero-config Next.js deployment |

### NPM Dependencies

```bash
# Core
npm install next react react-dom

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# AI & PDF Parsing
npm install @google/generative-ai pdf-parse-new

# UI & Interactions
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install recharts lucide-react react-hot-toast date-fns
```

---

## Project Structure

```
trackhire/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Route group — public auth pages
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── signup/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx             # Auth layout (centered card)
│   │   │
│   │   ├── auth/                      # Auth routes (outside route group)
│   │   │   └── callback/
│   │   │       └── route.js           # OAuth callback handler
│   │   │
│   │   ├── (dashboard)/               # Route group — protected pages
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx           # Main Kanban board
│   │   │   ├── applications/
│   │   │   │   └── page.jsx           # List/table view of all applications
│   │   │   ├── analytics/
│   │   │   │   └── page.jsx           # Charts & statistics
│   │   │   ├── ai-parser/
│   │   │   │   └── page.jsx           # JD + Resume matching page
│   │   │   ├── settings/
│   │   │   │   └── page.jsx           # Profile & resume settings
│   │   │   ├── layout.jsx             # Dashboard layout (sidebar + topbar)
│   │   │   ├── loading.jsx            # Dashboard loading skeleton
│   │   │   └── error.jsx              # Dashboard error boundary
│   │   │
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── parse-job/
│   │   │   │       └── route.js       # POST — Gemini parsing & resume matching
│   │   │   └── resumes/
│   │   │       └── upload/
│   │   │           └── route.js       # POST — Upload PDF, parse text, save to profile
│   │   │
│   │   ├── layout.jsx                 # Root layout (html, body, fonts)
│   │   ├── page.jsx                   # Landing page (public)
│   │   ├── not-found.jsx
│   │   └── error.jsx                  # Global error boundary
│   │
│   ├── components/
│   │   ├── ui/                        # Reusable primitives
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Input.module.css
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── Loader/
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Loader.module.css
│   │   │   └── EmptyState/
│   │   │       ├── EmptyState.jsx
│   │   │       └── EmptyState.module.css
│   │   │
│   │   └── layout/                    # Layout components
│   │       ├── Sidebar/
│   │       │   ├── Sidebar.jsx
│   │       │   └── Sidebar.module.css
│   │       ├── Topbar/
│   │       │   ├── Topbar.jsx
│   │       │   └── Topbar.module.css
│   │       └── LandingNav/
│   │           ├── LandingNav.jsx
│   │           └── LandingNav.module.css
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── AuthForm.module.css
│   │   │   └── useAuth.js             # Hook: login, signup, logout, getUser, OAuth
│   │   │
│   │   ├── applications/
│   │   │   ├── ApplicationCard/
│   │   │   │   ├── ApplicationCard.jsx
│   │   │   │   └── ApplicationCard.module.css
│   │   │   ├── ApplicationForm/
│   │   │   │   ├── ApplicationForm.jsx     # Add/edit application modal
│   │   │   │   └── ApplicationForm.module.css
│   │   │   ├── ApplicationTable/
│   │   │   │   ├── ApplicationTable.jsx    # Table view
│   │   │   │   └── ApplicationTable.module.css
│   │   │   └── hooks/
│   │   │       ├── useApplications.js      # CRUD operations
│   │   │       └── useApplicationMutations.js
│   │   │
│   │   ├── kanban/
│   │   │   ├── KanbanBoard/
│   │   │   │   ├── KanbanBoard.jsx         # DndContext wrapper
│   │   │   │   └── KanbanBoard.module.css
│   │   │   ├── KanbanColumn/
│   │   │   │   ├── KanbanColumn.jsx        # Droppable column
│   │   │   │   └── KanbanColumn.module.css
│   │   │   ├── KanbanCard/
│   │   │   │   ├── KanbanCard.jsx          # Draggable card
│   │   │   │   └── KanbanCard.module.css
│   │   │   └── hooks/
│   │   │       └── useKanban.js            # Drag handlers, state
│   │   │
│   │   ├── ai-parser/
│   │   │   ├── JobParser/
│   │   │   │   ├── JobParser.jsx           # Paste JD + comparison results
│   │   │   │   └── JobParser.module.css
│   │   │   └── hooks/
│   │   │       └── useParseJob.js          # Calls /api/ai/parse-job
│   │   │
│   │   ├── resumes/
│   │   │   ├── ResumeUpload/
│   │   │   │   ├── ResumeUpload.jsx        # Upload component for settings/parser
│   │   │   │   └── ResumeUpload.module.css
│   │   │   └── hooks/
│   │   │       └── useResume.js            # Upload / fetch resume details
│   │   │
│   │   ├── analytics/
│   │   │   ├── StatsCards/
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   └── StatsCards.module.css
│   │   │   ├── StatusChart/
│   │   │   │   └── StatusChart.jsx         # Pie chart — applications by status
│   │   │   ├── TimelineChart/
│   │   │   │   └── TimelineChart.jsx       # Area chart — applications over time
│   │   │   ├── ResponseRateChart/
│   │   │   │   └── ResponseRateChart.jsx   # Bar chart — response vs ghosted
│   │   │   └── hooks/
│   │   │       └── useAnalytics.js
│   │   │
│   │   └── settings/
│   │       ├── ProfileSettings.jsx         # Displays user settings + resume upload info
│   │       └── Settings.module.css
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.js               # createBrowserClient
│   │   │   └── server.js               # createServerClient
│   │   └── gemini.js                   # Gemini AI client init
│   │
│   ├── styles/
│   │   ├── globals.css                 # CSS reset, variables, typography
│   │   └── themes.css                  # Dark/light theme variables
│   │
│   └── utils/
│       ├── constants.js                # Status columns, priority levels, etc.
│       └── helpers.js                  # Date formatting, color helpers
│
└── middleware.js                       # Supabase session refresh + route protection
├── .env.local                          # Environment variables
├── next.config.mjs
└── package.json
```

---

## Supabase Database Schema

### Table: `profiles`
Auto-created on signup via a database trigger. Stores user metadata, including uploaded resume details.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, references `auth.users(id)` ON DELETE CASCADE | User ID |
| `email` | `text` | NOT NULL | User's email |
| `full_name` | `text` | | Display name |
| `avatar_url` | `text` | | Profile picture URL |
| `resume_url` | `text` | | URL path of resume in Supabase Storage |
| `resume_text` | `text` | | Extracted plain text of resume for AI queries |
| `created_at` | `timestamptz` | DEFAULT `now()` | Account creation |

```sql
-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### Table: `applications`
The core table. Each row is one job application.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Application ID |
| `user_id` | `uuid` | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE | Owner |
| `company` | `text` | NOT NULL | Company name |
| `position` | `text` | NOT NULL | Job title / role |
| `status` | `text` | NOT NULL, DEFAULT `'wishlist'` | One of: `wishlist`, `applied`, `interview`, `offer`, `rejected`, `ghosted` |
| `priority` | `text` | DEFAULT `'medium'` | `low`, `medium`, `high` |
| `job_url` | `text` | | Link to the job posting |
| `salary_min` | `integer` | | Salary range lower bound |
| `salary_max` | `integer` | | Salary range upper bound |
| `location` | `text` | | City / Remote / Hybrid |
| `job_type` | `text` | DEFAULT `'full-time'` | `full-time`, `part-time`, `contract`, `internship` |
| `notes` | `text` | | Personal notes |
| `applied_at` | `date` | | Date applied |
| `interview_at` | `timestamptz` | | Upcoming interview datetime |
| `followed_up` | `boolean` | DEFAULT `false` | Whether user sent a follow-up |
| `contact_name` | `text` | | Recruiter / hiring manager name |
| `contact_email` | `text` | | Their email |
| `position_index` | `integer` | DEFAULT `0` | For ordering cards within a Kanban column |
| `created_at` | `timestamptz` | DEFAULT `now()` | Record creation |
| `updated_at` | `timestamptz` | DEFAULT `now()` | Last update |

```sql
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  status text NOT NULL DEFAULT 'wishlist',
  priority text DEFAULT 'medium',
  job_url text,
  salary_min integer,
  salary_max integer,
  location text,
  job_type text DEFAULT 'full-time',
  notes text,
  applied_at date,
  interview_at timestamptz,
  followed_up boolean DEFAULT false,
  contact_name text,
  contact_email text,
  position_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Compound index for fast Kanban queries (user + status + ordering)
CREATE INDEX idx_applications_user_status_position
  ON applications(user_id, status, position_index);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

### Table: `activity_log`
Records significant changes for the timeline/feed.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Log entry ID |
| `user_id` | `uuid` | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE | Owner |
| `application_id` | `uuid` | FK → `applications(id)` ON DELETE CASCADE | Related application |
| `action` | `text` | NOT NULL | e.g. `created`, `status_changed`, `interview_scheduled` |
| `details` | `jsonb` | | Extra context, e.g. `{"from": "applied", "to": "interview"}` |
| `created_at` | `timestamptz` | DEFAULT `now()` | When it happened |

```sql
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_user_id ON activity_log(user_id);

---

### Supabase Storage: `resumes` Bucket
A storage bucket for storing user PDF resumes.

- **Bucket Name**: `resumes`
- **File Structure**: `{user_id}/resume.pdf` (enforces user partitioning)

#### Storage RLS Policies
```sql
-- Allow users to upload files to their own folder
CREATE POLICY "Users can upload their own resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read files in their own folder
CREATE POLICY "Users can view their own resumes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete files in their own folder
CREATE POLICY "Users can delete their own resumes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to re-upload (update) files in their own folder
CREATE POLICY "Users can update their own resumes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```
```

---

### Row Level Security (RLS) Policies

All tables have RLS enabled. Every policy uses the optimized `(SELECT auth.uid())` pattern to avoid per-row re-evaluation.

```sql
-- ==================== PROFILES ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = (SELECT auth.uid()));

-- ==================== APPLICATIONS ====================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own applications"
  ON applications FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ==================== ACTIVITY LOG ====================
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own activity"
  ON activity_log FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));
```

---

## Authentication Flow

### Setup Files

#### `src/lib/supabase/client.js` — Browser Client
```javascript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

#### `src/lib/supabase/server.js` — Server Client
```javascript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

#### `middleware.js` — Session Refresh + Route Protection
```javascript
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Whitelist public routes — everything else is protected by default
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)
    || request.nextUrl.pathname.startsWith("/auth/");

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in, redirect away from auth pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

#### Auth Flow callback: `src/app/auth/callback/route.js`
This route exchanges the temporary authorization code returned by Google OAuth (or email confirmation links) for a persistent user session cookie.

```javascript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login with an error message
  return NextResponse.redirect(`${origin}/login?error=Could not complete OAuth authentication`);
}
```

#### Auth Flow Diagram

```
User clicks "Sign in with Google"
  → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '.../auth/callback' } })`
  → Supabase redirects to Google OAuth Consent Screen
  → Google redirects back to /auth/callback?code=xxx
  → Callback route exchanges code for cookie session
  → Browser session is initialized, redirects to /dashboard

User signs up with email/password
  → Supabase creates user account
  → DB trigger handle_new_user() runs, creating profiles row
  → User logged in, lands on /dashboard
```

---

## Gemini AI & Resume Parsing Integration

### Architecture

All document parsing and AI evaluation occurs **server-side** to keep API keys secure and handle binary file streams cleanly.

1. **Resume Processing**: The user uploads their resume (PDF format). The file is validated (type + size), processed server-side with `pdf-parse-new` to extract clean plain text, which is cached in their database profile (`profiles.resume_text`) and the original file is stored in a **private** Supabase Storage bucket (`resumes/{user_id}/resume.pdf`). The file path is stored in `profiles.resume_url` — signed URLs are generated on demand when the user needs to view/download.
2. **AI Comparison & Extraction**: When parsing a job description, if the user opts to compare their resume, the server retrieves the cached resume text, packages it alongside the job description in a prompt, and queries Gemini.

#### `src/lib/gemini.js`
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
```

#### `src/app/api/resumes/upload/route.js` — Resume Upload & Text Extraction
This endpoint handles file upload form-data, validates file type/size, runs `pdf-parse-new` on the file buffer, uploads the PDF to Supabase Storage, and updates the user's profile with the file path and extracted text.

```javascript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse-new";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    // Convert file to buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text using pdf-parse
    const parsedPdf = await pdfParse(buffer);
    const resumeText = parsedPdf.text.trim();

    if (!resumeText) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Upload to Supabase Storage resumes bucket
    const filePath = `${user.id}/resume.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Storage upload error: ${uploadError.message}`);
    }

    // Store file path (not public URL) — generate signed URLs on demand for downloads
    const resumeFilePath = filePath;

    // Update profile table with resume details
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        resume_url: resumeFilePath,
        resume_text: resumeText,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(`Profile update error: ${profileError.message}`);
    }

    return NextResponse.json({
      success: true,
      resumeUrl: resumeFilePath,
      message: "Resume uploaded and parsed successfully",
    });
  } catch (error) {
    console.error("Resume upload failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process resume" }, { status: 500 });
  }
}
```

#### `src/app/api/ai/parse-job/route.js` — Job Analysis & Resume Matcher
Analyzes a job description using Gemini. If `compareResume` is true, fetches the user's resume text and compares it against the JD to compute match scores and action items.

```javascript
import { geminiModel } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobDescription, compareResume } = await request.json();
  if (!jobDescription) {
    return NextResponse.json({ error: "Job description is required" }, { status: 400 });
  }

  // Limit input length to prevent token limit issues and API abuse
  if (jobDescription.length > 15000) {
    return NextResponse.json(
      { error: "Job description is too long (max 15,000 characters). Please paste only the relevant posting." },
      { status: 400 }
    );
  }

  let resumeText = null;
  if (compareResume) {
    // Retrieve resume text from profile cache
    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_text")
      .eq("id", user.id)
      .single();
    
    if (profile?.resume_text) {
      resumeText = profile.resume_text;
    }
  }

  // Construct Gemini Prompt
  let prompt = `
    Analyze the following job description and extract structured information.
    Return ONLY valid JSON (no markdown, no code fences, no extra text) with this exact schema:
    {
      "company": "string",
      "position": "string",
      "location": "string (city, state or Remote/Hybrid)",
      "job_type": "one of: full-time, part-time, contract, internship",
      "salary_min": number or null,
      "salary_max": number or null,
      "key_requirements": ["string", "string", ...],
      "summary": "A 2-3 sentence summary of the role"
  `;

  if (resumeText) {
    prompt += `,
      "match_score": number (integer between 0 and 100 representing how well the candidate matches this role),
      "matching_skills": ["string", "string", ...],
      "missing_skills": ["string", "string", ...],
      "resume_suggestions": ["string", "string", ...]
    `;
  }

  prompt += `
    }

    Job Description:
    ${jobDescription}
  `;

  if (resumeText) {
    prompt += `
    
    Candidate Resume Text:
    ${resumeText}
    `;
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Clean up any potential markdown code fences in the output
    const cleanJsonText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanJsonText);

    return NextResponse.json({ data: parsed });
  } catch (error) {
    console.error("Gemini processing failed:", error);
    return NextResponse.json({ error: "Failed to process job description" }, { status: 500 });
  }
}
```

#### Client-Side Hook: `src/features/ai-parser/hooks/useParseJob.js`
```javascript
"use client";
import { useState } from "react";

export function useParseJob() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function parseJob(jobDescription, compareResume = false) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, compareResume }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to analyze job");
      setData(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, parseJob };
}
```

### AI Parser & Matcher Page UX Flow

```
┌──────────────────────────────────────────────────────────┐
│  TrackHire — AI Job Analyzer                             │
│                                                          │
│  [ Upload Resume (PDF) ]  → Status: Uploaded (PDF)       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Paste any job description here...                  │  │
│  │ (large textarea)                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  [x] Compare against my uploaded resume                  │
│                                                          │
│  [ ✨ Analyze & Match with AI ]                          │
│                                                          │
│  ── Analysis Results ─────────────────────────────────── │
│                                                          │
│  Company:      Google           Match Score: [ 82% ]     │
│  Position:     Frontend Eng.    Salary: $120k - $180k    │
│  Location:     Remote           Type: Full-time          │
│                                                          │
│  Summary:      Build user-facing features...             │
│                                                          │
│  ┌──────────────────────────┐ ┌────────────────────────┐ │
│  │ Matching Skills          │ │ Missing Skills / Gaps  │ │
│  │ • React / Next.js        │ │ • GraphQL              │ │
│  │ • CSS modules            │ │ • End-to-end testing   │ │
│  └──────────────────────────┘ └────────────────────────┘ │
│                                                          │
│  Resume Tailoring Suggestions:                           │
│  • Highlight Next.js 15 routing features in your experience│
│  • Mention any end-to-end testing libraries used previously│
│                                                          │
│  [ ➕ Add to My Applications ]                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Clicking "Add to My Applications" pre-fills the ApplicationForm modal with the extracted data, and saves it to Supabase.

---

## Kanban Board Architecture

### Status Columns (defined in `utils/constants.js`)

```javascript
export const STATUSES = [
  { id: "wishlist",  label: "Wishlist",  color: "#8b5cf6" },  // purple
  { id: "applied",   label: "Applied",   color: "#3b82f6" },  // blue
  { id: "interview", label: "Interview", color: "#f59e0b" },  // amber
  { id: "offer",     label: "Offer",     color: "#22c55e" },  // green
  { id: "rejected",  label: "Rejected",  color: "#ef4444" },  // red
  { id: "ghosted",   label: "Ghosted",   color: "#6b7280" },  // gray
];

export const PRIORITIES = [
  { id: "low",    label: "Low",    color: "#6b7280" },
  { id: "medium", label: "Medium", color: "#f59e0b" },
  { id: "high",   label: "High",   color: "#ef4444" },
];

export const JOB_TYPES = [
  { id: "full-time",  label: "Full-time" },
  { id: "part-time",  label: "Part-time" },
  { id: "contract",   label: "Contract" },
  { id: "internship", label: "Internship" },
];
```

### Drag & Drop Flow

```
User drags a card from "Applied" column
  → onDragStart: store active card ID, snapshot current state for rollback, show DragOverlay
  → onDragOver: detect which column the card is hovering over
  → onDragEnd:
      1. Snapshot previous state for rollback
      2. Update local state (optimistic UI)
      3. Update Supabase: SET status = 'interview', position_index = X
         → On failure: restore previous state snapshot, show error toast
      4. Insert activity_log row: { action: 'status_changed', details: { from: 'applied', to: 'interview' } }
      5. Show toast: "Moved Company X to Interview"
  → Position ordering: use gap-based indexing (1000, 2000, 3000...) — insert between at midpoint
```

### Component Hierarchy

```
<KanbanBoard>                           ← DndContext + SortableContext
  ├── <KanbanColumn status="wishlist">  ← useDroppable
  │     ├── <KanbanCard app={...} />    ← useSortable
  │     ├── <KanbanCard app={...} />
  │     └── <AddCardButton />
  ├── <KanbanColumn status="applied">
  │     └── ...
  ├── <KanbanColumn status="interview">
  │     └── ...
  ├── <KanbanColumn status="offer">
  │     └── ...
  ├── <KanbanColumn status="rejected">
  │     └── ...
  └── <KanbanColumn status="ghosted">
        └── ...
  <DragOverlay>
    <KanbanCard />                       ← Visual clone of dragged card
  </DragOverlay>
</KanbanBoard>
```

### KanbanCard Contents

Each card displays:
- **Company name** (bold)
- **Position** (subtitle)
- **Priority badge** (colored dot)
- **Location** (small text)
- **Applied date** (relative, e.g. "3 days ago")
- **Click to open** → ApplicationForm modal in edit mode

---

## Analytics Dashboard

### Stats Cards (top row)

| Card | Metric | Calculation |
|---|---|---|
| Total Applications | Count | `COUNT(*)` |
| Interview Rate | Percentage | `COUNT(status IN interview,offer) / COUNT(status != wishlist) × 100` |
| Offer Rate | Percentage | `COUNT(status = offer) / COUNT(*) × 100` |
| Active This Week | Count | `COUNT(*) WHERE applied_at >= now() - interval '7 days'` |

### Charts

1. **Status Distribution** — `PieChart` (Recharts)
   - Slices: one per status, colored to match STATUSES constants
   
2. **Applications Over Time** — `AreaChart`
   - X-axis: weeks/months
   - Y-axis: number of applications submitted
   - Data: GROUP BY `DATE_TRUNC('week', applied_at)`

3. **Response Rate** — `BarChart`
   - Bars: Responded (interview + offer) vs. Ghosted vs. Rejected
   - Gives the user a clear picture of employer engagement

### Data Fetching Pattern

All analytics data is computed **server-side** using Supabase queries in the page's server component, then passed to client chart components as props. This keeps charts fast and avoids loading states.

```
analytics/page.jsx (Server Component)
  → Fetch all user's applications from Supabase
  → Compute stats in JS
  → Pass computed data as props to:
      <StatsCards data={stats} />         ← Client Component
      <StatusChart data={statusData} />   ← Client Component
      <TimelineChart data={timeline} />   ← Client Component
```

---

## Page Designs Overview

### 1. Landing Page (`/`)
- Hero section with headline, subtitle, and CTA buttons (Login / Sign Up)
- Feature highlights (3-4 cards): Kanban, AI Parser, Analytics, etc.
- Dark themed, modern aesthetic

### 2. Dashboard (`/dashboard`)
- Full-width Kanban board
- Topbar with: search, "Add Application" button, user avatar
- Sidebar with navigation links
- Recent activity feed panel (uses `activity_log` table)

### 3. Applications (`/applications`)
- Table view with all applications
- Columns: Company, Position, Status (badge), Priority, Applied Date, Location
- Sortable columns, search/filter bar
- Click row → open edit modal

### 4. AI Parser (`/ai-parser`)
- Large textarea to paste job description
- "Analyze" button triggers Gemini
- Results card with extracted fields
- "Add to Applications" button auto-creates entry
- Rate limited: basic per-user throttling to protect Gemini API quota

### 5. Analytics (`/analytics`)
- Stats cards row
- Charts grid (2×2)

### 6. Settings (`/settings`)
- Edit display name, avatar
- Account info (email, joined date)

---

## Styling Architecture

### Design Tokens (`globals.css`)

```css
:root {
  /* Background */
  --bg-primary: hsl(222, 47%, 7%);
  --bg-secondary: hsl(220, 35%, 12%);
  --bg-tertiary: hsl(218, 30%, 18%);
  --bg-card: hsl(220, 33%, 14%);

  /* Text */
  --text-primary: hsl(210, 40%, 96%);
  --text-secondary: hsl(215, 20%, 65%);
  --text-tertiary: hsl(215, 16%, 47%);

  /* Accent */
  --accent: hsl(250, 85%, 65%);         /* Indigo-ish */
  --accent-hover: hsl(250, 85%, 72%);
  --accent-subtle: hsla(250, 85%, 65%, 0.15);

  /* Status Colors */
  --status-wishlist: hsl(263, 70%, 58%);
  --status-applied: hsl(217, 91%, 60%);
  --status-interview: hsl(38, 92%, 50%);
  --status-offer: hsl(142, 71%, 45%);
  --status-rejected: hsl(0, 84%, 60%);
  --status-ghosted: hsl(220, 9%, 46%);

  /* Borders & Misc */
  --border: hsl(215, 28%, 22%);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);

  /* Typography */
  --font-sans: 'Inter', sans-serif;
}
```

### Approach
- **Dark theme by default** — professional, modern look
- **CSS Modules** for all component styling (scoped, no conflicts)
- **CSS Variables** for the design tokens (easy theming)
- Google Fonts: **Inter** (clean, professional)

---

## Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Gemini AI (server-side only — no NEXT_PUBLIC_ prefix)
GEMINI_API_KEY=AIzaSy...
```

> [!IMPORTANT]
> `GEMINI_API_KEY` does **NOT** have the `NEXT_PUBLIC_` prefix. This ensures it is only accessible on the server (API routes), never exposed to the browser.

---

## Next.js Configuration

### `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google OAuth avatars
    ],
  },
  // Required for pdf-parse-new to work in serverless functions
  serverExternalPackages: ['pdf-parse-new'],
};

export default nextConfig;
```

> [!IMPORTANT]
> `serverExternalPackages` prevents Webpack from bundling `pdf-parse-new`, which relies on Node.js built-ins (`fs`, `Buffer`) that are not available in the Webpack bundle. Without this, the build will fail.

> [!NOTE]
> **Vercel Function Timeout**: Gemini API calls and PDF parsing can take 5-10 seconds. Vercel's free tier enforces a **10-second timeout** on serverless functions. For the AI route, add `export const maxDuration = 30;` at the top of the route file (requires Vercel Pro plan for >10s). On the free tier, keep prompts concise to stay under the limit.

---

## Day-by-Day Build Plan

### Day 1 — Foundation
- [ ] Initialize Next.js project named `trackhire` with App Router
- [ ] Set up Supabase project: create tables (`profiles`, `applications`, `activity_log`), triggers, and RLS policies
- [ ] Set up Supabase Storage: create `resumes` bucket with user-partitioned folder RLS policies
- [ ] Configure `@supabase/ssr` (client.js, server.js, middleware.js)
- [ ] Configure Google OAuth client in Supabase dashboard and setup Google Console credentials
- [ ] Build auth pages (login, signup, OAuth callback route `/auth/callback`)
- [ ] Create root layout, dashboard layout (sidebar + topbar)
- [ ] Set up `globals.css` with design tokens
- [ ] Build reusable UI components (Button, Input, Modal, Badge)

### Day 2 — Core Features
- [ ] Build ApplicationForm (create/edit modal)
- [ ] Build applications CRUD hooks (useApplications, useApplicationMutations)
- [ ] Build Kanban board (KanbanBoard, KanbanColumn, KanbanCard)
- [ ] Implement drag-and-drop with @dnd-kit (cross-column moves)
- [ ] Build Applications table view page
- [ ] Add activity logging on status changes

### Day 3 — AI + Analytics
- [ ] Implement PDF Resume upload API (`/api/resumes/upload`) using `pdf-parse-new` server-side (with file type/size validation)
- [ ] Build `ResumeUpload` component and integrate into Settings & AI Parser pages
- [ ] Set up Gemini API route (`/api/ai/parse-job`) with input length validation and optional resume matching/scoring
- [ ] Build AI Parser page with resume selector (Paste JD → analyze & match score → display → add to apps)
- [ ] Build Analytics page with stats cards
- [ ] Build charts: StatusChart, TimelineChart, ResponseRateChart
- [ ] Build Settings page (profile updates and primary resume management)

### Day 4 — Polish + Deploy
- [ ] Landing page design for **TrackHire**
- [ ] Responsive design pass (mobile sidebar, cards, tables)
- [ ] Loading states (`loading.jsx`), empty states, error boundaries (`error.jsx`)
- [ ] Toast notifications throughout the app
- [ ] SEO: meta tags, Open Graph
- [ ] Configure `next.config.mjs` (image domains, `serverExternalPackages`)
- [ ] Deploy to Vercel + configure env variables
- [ ] Write README.md
- [ ] Final testing and bug fixes

---

## Implementation Confirmation
The three key architectural options have been confirmed:
1. **Google OAuth**: Enabled alongside standard email/password authentication.
2. **Resume Parser**: Resume uploading (stored in Supabase Storage `resumes` bucket) and PDF parsing (via server-side `pdf-parse-new`) is enabled. This will feed into Gemini's evaluation system to yield job matching/scoring analysis.
3. **Project Name**: Confirmed as **TrackHire**.
