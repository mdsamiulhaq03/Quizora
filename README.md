# QUIZORA

PDF-to-quiz learning engine. Upload any PDF, get AI-generated questions, track progress with spaced repetition.

## Features

- **PDF Upload** — Extract text from any PDF (up to 10MB) and generate quizzes instantly
- **AI Question Generation** — Groq (Llama 3.3 70B) produces MCQ, true/false, and fill-in-the-blank questions
- **Difficulty Levels** — Easy, medium, or hard with configurable question count (5–20)
- **Spaced Repetition** — SM-2 algorithm schedules weak questions for review at optimal intervals
- **Progress Dashboard** — Score history, topic weakness map, streak tracking, activity heatmap
- **Guest Mode** — Try without an account; full features unlock on sign-up
- **Dark / Light Mode** — Persisted via localStorage

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v5 (GitHub, Google, Email/Password) |
| AI | Groq SDK — Llama 3.3 70B |
| Cache | Upstash Redis |
| Email | Resend |
| Animations | Framer Motion |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/quizora.git
cd quizora
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret

# MongoDB
MONGODB_URI=mongodb+srv://...

# Groq
GROQ_API_KEY=gsk_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Resend (email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Cron
CRON_SECRET=your-random-secret
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## OAuth Setup

### GitHub
1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Secret into `.env.local`

### Google
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add to **Authorized JavaScript origins**: `http://localhost:3000`
4. Add to **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Secret into `.env.local`

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add all `.env.local` variables as Vercel environment variables
4. Update `NEXTAUTH_URL` to your production URL
5. Update OAuth callback URLs in GitHub and Google consoles to your production domain

## Routes

| Path | Access |
|---|---|
| `/` | Everyone |
| `/upload` | Everyone |
| `/quiz/[quizId]` | Everyone |
| `/results/[attemptId]` | Everyone |
| `/dashboard` | Signed in |
| `/library` | Signed in |
| `/review` | Signed in |
| `/quiz-history` | Signed in |
| `/profile` | Signed in |

## Project Structure

```
app/
├── (auth)/          # Login, register
├── (protected)/     # Dashboard, library, review, profile
├── (shared)/        # Upload, quiz, results
├── actions/         # Server actions
└── api/             # API routes (quiz, review, export, cron)

components/
├── charts/          # Recharts visualizations
├── dashboard/       # Dashboard widgets
├── home/            # Landing page
├── library/         # PDF library grid
├── profile/         # Profile panel
├── quiz/            # Question card, timer, flag button
├── results/         # Results client
└── shared/          # Navbar, theme provider, banners

lib/
├── models/          # Mongoose models
├── auth.ts          # NextAuth config
├── config.ts        # App constants
├── processPdfJob.ts # PDF processing + quiz generation
├── srs.ts           # Spaced repetition logic
└── redis.ts         # Upstash Redis client + cache keys
```

## License

MIT
