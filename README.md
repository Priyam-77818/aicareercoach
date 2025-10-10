# Mentroly

An AI-powered career coaching platform that helps professionals land jobs faster — with smart resume building, AI-generated cover letters, mock interview prep, and real-time industry insights.

Built with Next.js 16, Clerk, Google Gemini AI, Prisma, and Tailwind CSS.

---

## What It Does

Mentroly guides you through every step of your job search:

- Onboard with your industry and skills
- Build an ATS-optimized resume with AI assistance
- Generate tailored cover letters for any job posting
- Practice with AI-generated mock interview quizzes
- Track your interview performance over time
- Get weekly-updated industry insights, salary data, and skill trends

---

## Features

### AI-Powered Career Guidance
Personalized career advice based on your industry, experience level, and skill set — powered by Google Gemini 1.5 Flash.

### Smart Resume Builder
Create and edit your resume in a markdown editor. Use the "Improve with AI" feature to rewrite any section with stronger action verbs, quantifiable results, and industry-specific keywords.

### AI Cover Letter Generator
Input a job title, company name, and job description — Mentroly generates a professional, tailored cover letter in seconds. All letters are saved to your account for future reference.

### Mock Interview Preparation
Get 10 AI-generated multiple-choice technical questions based on your industry and skills. After each quiz, receive a score and an AI-generated improvement tip targeting your weak areas.

### Interview Performance Tracking
All quiz results are stored and displayed as a progress chart so you can see how your scores improve over time.

### Industry Insights Dashboard
Weekly-updated data for your industry including:
- Salary ranges by role and location
- Industry growth rate and demand level
- Market outlook (Positive / Neutral / Negative)
- Top in-demand skills and key trends
- Recommended skills to learn

---

## How It Works

1. **Sign Up & Onboard** — Create an account via Clerk and complete your professional profile (industry, years of experience, skills, bio)
2. **Build Your Documents** — Use the resume builder and cover letter generator to create ATS-ready application materials
3. **Practice Interviews** — Take AI-generated quizzes tailored to your role and get instant feedback
4. **Track Progress** — Monitor your quiz scores and improvement tips on the dashboard

---

## Stats

| Metric | Value |
|---|---|
| Industries Covered | 50+ |
| Interview Questions | 1000+ |
| Success Rate | 95% |
| AI Support | 24/7 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Clerk |
| AI | Google Gemini 1.5 Flash |
| Database | PostgreSQL + Prisma ORM |
| Background Jobs | Inngest |
| UI | shadcn/ui + Tailwind CSS v4 |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Database Models

- `User` — profile, industry, skills, experience, bio
- `Resume` — markdown content, one per user
- `CoverLetter` — content, job title, company, status
- `Assessment` — quiz scores, per-question results, AI improvement tips
- `IndustryInsight` — salary ranges, growth rate, demand level, trends (shared per industry, updated weekly)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Priyam-77818/aicareercoach.git
cd aicareercoach
npm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL=your_postgresql_connection_string

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
app/
  (auth)/         # Sign-in and sign-up pages
  (main)/
    dashboard/    # Industry insights dashboard
    resume/       # Resume builder
    ai-cover-letter/ # Cover letter generator and list
    interview/    # Mock interview quizzes and results
    onboarding/   # User profile setup
  api/inngest/    # Inngest background job handler
actions/          # Server actions (resume, cover letter, interview, dashboard, user)
components/       # Header, Hero, shadcn/ui components
data/             # Static data (features, FAQs, testimonials, how it works)
lib/              # Prisma client, Inngest client, checkUser utility
prisma/           # Schema and migrations
```

---

## Deployment

Deploy on [Vercel](https://vercel.com) — add all environment variables in the Vercel dashboard. Make sure your PostgreSQL database (e.g. Neon, Supabase) is accessible from Vercel's network.

---

## Author

Made by [Priyam](https://github.com/Priyam-77818)
