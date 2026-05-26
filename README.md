# QuizForge - PDF-to-MCQ Learning App

A full-stack Next.js 15 app: upload PDFs, Groq AI generates adaptive quizzes, track performance with spaced repetition.

## Tech Stack

- Next.js 15.2.6 (App Router, Server Actions)
- Groq SDK with llama-3.3-70b-versatile
- MongoDB Atlas via Mongoose
- pdf-parse for PDF text extraction
- next-auth v5 - GitHub + Google OAuth + Email Magic Link via Resend
- Upstash Redis for caching + rate limiting
- Inngest for background jobs
- Tailwind CSS + framer-motion + Recharts

## Setup

1. Install dependencies: npm install
2. Fill in .env.local with real credentials (see file for keys)
3. Run dev server: npm run dev
4. Run Inngest dev server: npx inngest-cli@latest dev

## Routes

- / - Landing page (all)
- /upload - Upload PDF + configure quiz (guests + auth)
- /quiz/[quizId] - Take a quiz (guests + auth)
- /results/[attemptId] - View results (guests + auth)
- /dashboard - Progress dashboard (auth only)
- /library - PDF library (auth only)
- /review - Spaced repetition review (auth only)
- /quiz-history - All past attempts (auth only)
- /profile - Account (auth only)
- /share/[slug] - Public quiz + leaderboard (all)

## Usage Limits

- Guest: 1 PDF upload ever, 1 Groq call
- Authenticated: 3 PDF uploads/day, 10 Groq calls/day
- All users: 2000-word PDF text cap before sending to Groq

## Architecture

- lib/models/ - User, PDF, Quiz, Attempt, WeakQuestion, QuizSession
- lib/auth.ts - NextAuth with MongoDB adapter (server only)
- lib/auth.config.ts - Edge-safe auth config for middleware
- lib/srs.ts - SRS intervals [1, 3, 7, 14, 30] days
- lib/dedup.ts - Levenshtein question deduplication (>85% similarity)
- inngest/functions/ - processPdf, sendReviewReminder, cleanupGuestData
