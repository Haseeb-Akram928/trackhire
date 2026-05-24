# ✨ TrackHire — Full-Stack AI Job Application Tracker & Pipeline

TrackHire is a full-stack Next.js 15 (App Router) application designed for modern job seekers. It features an interactive, drag-and-drop Kanban applications board, server-side PDF resume parsing, Google Gemini AI job matching, and detailed Recharts analytics dashboards.

---

## 🚀 Key Features

*   **Interactive Kanban Pipeline**: Drag and drop applications across custom statuses (Wishlist, Applied, Interview, Offer, Rejected, Ghosted) with optimistic UI updates and midpoint ordering.
*   **AI Job description Parser**: Paste any job posting and let Google Gemini extract company details, positions, locations, salary brackets, key requirements, and match scores.
*   **Resume PDF Extractor**: Upload PDF resumes to private user-partitioned storage buckets. Extracted plaintext is cached in database profiles for Gemini match evaluation.
*   **Analytics Dashboard**: Visual analytics including Pie, Area, and Bar charts highlighting application volume timeline, outcome rates, and pipeline distribution.
*   **Secure Partitioning**: Secured database tables using PostgreSQL Row Level Security (RLS) policies and authorized cookie sessions refresh via Supabase SSR Middleware.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Database & Auth**: Supabase (PostgreSQL, RLS, Storage Buckets, SSR Auth, Google OAuth)
*   **AI Engine**: Google Gemini API (`gemini-2.0-flash` model via `@google/generative-ai`)
*   **Document Extractor**: `pdf-parse-new`
*   **Drag & Drop**: `@dnd-kit/core` + `@dnd-kit/sortable`
*   **Visualizations**: Recharts
*   **Styling**: Premium scoped CSS Modules (Harmony dark theme HSL variables)
*   **Notifications**: `react-hot-toast`

---

## ⚙️ Environment Configuration

Create a `.env.local` file at the root of the project directory with the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-public-anon-key

# Gemini AI (Server-side ONLY - no NEXT_PUBLIC_ prefix)
GEMINI_API_KEY=your-google-gemini-api-key
```

---

## 🗄️ Supabase Database Schema

To set up the backend database structure, run the following SQL queries inside your Supabase project's **SQL Editor**:

### 1. `profiles` Table & Trigger
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  resume_url text,
  resume_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (id = (SELECT auth.uid()));

-- Automatically create profile on user signup
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. `applications` Table & Indexing
```sql
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE INDEX idx_applications_user_status_position
  ON public.applications(user_id, status, position_index);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user partitioning
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own applications"
  ON public.applications FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Automatically update modified date
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. `activity_log` Table
```sql
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_user_id ON public.activity_log(user_id);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON public.activity_log FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own activity"
  ON public.activity_log FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
```

---

## 📦 Storage Bucket Setup

Create a new bucket named **`resumes`** in the **Storage** section of your Supabase dashboard and set it to **Private**. Add the following RLS policies to restrict read, write, and delete permissions:

### Storage Policies Configuration:
```sql
-- 1. INSERT Policy (Uploads)
CREATE POLICY "Users can upload their own resumes"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 2. SELECT Policy (Reads)
CREATE POLICY "Users can view their own resumes"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. DELETE Policy (Removals)
CREATE POLICY "Users can delete their own resumes"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. UPDATE Policy (Re-uploads)
CREATE POLICY "Users can update their own resumes"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 🏃 Local Development Setup

To run TrackHire locally:

1.  Clone the repository and navigate to the project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment variables inside `.env.local`.
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Vercel Deployment Notes

*   **Turbopack & serverExternalPackages**: This project relies on `pdf-parse-new` which uses Node.js native packages. Our `next.config.mjs` configures `serverExternalPackages: ['pdf-parse-new']` so that Vercel packages it natively instead of bundling it inside Webpack.
*   **Vercel Serverless Function Timeout**: PDF text parsing and Gemini queries can exceed the default 10s serverless limit on free Vercel accounts. We define `export const maxDuration = 30;` on AI API routes to prevent gateway timeouts.
