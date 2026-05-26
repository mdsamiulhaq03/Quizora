import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import Attempt from "@/lib/models/Attempt";
import User from "@/lib/models/User";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ publicSlug: string }>;
}) {
  const { publicSlug } = await params;

  await dbConnect();
  const quiz = await Quiz.findOne({ publicSlug, isPublic: true }).lean();
  if (!quiz) notFound();

  const cacheKey = CACHE_KEYS.leaderboard(publicSlug);
  let leaderboard: LeaderboardEntry[] =
    (await redis.get<LeaderboardEntry[]>(cacheKey)) || [];

  if (!leaderboard.length) {
    const topAttempts = await Attempt.find({ quizId: quiz._id, userId: { $ne: null } })
      .sort({ score: -1 })
      .limit(5)
      .lean();

    const entries: LeaderboardEntry[] = [];
    for (const attempt of topAttempts) {
      const user = await User.findOne({ _id: attempt.userId }).select("name").lean();
      entries.push({
        name: (user as { name?: string } | null)?.name || "ANONYMOUS",
        score: attempt.score,
        total: attempt.total,
      });
    }
    leaderboard = entries;
    await redis.setex(cacheKey, CACHE_TTL.leaderboard, leaderboard);
  }

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-0">

        {/* Quiz info */}
        <div className="border border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate flex items-center justify-between">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              PUBLIC QUIZ / {publicSlug.toUpperCase()}
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              ● PUBLIC
            </span>
          </div>
          <div className="px-5 py-5">
            <h1
              className="font-display uppercase text-ink leading-none mb-2"
              style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", letterSpacing: "-0.02em" }}
            >
              {quiz.title.toUpperCase()}
            </h1>
            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-5">
              {quiz.difficulty?.toUpperCase()} DIFFICULTY · {quiz.questionCount} QUESTIONS
            </p>
            <Link
              href={`/quiz/${quiz._id}`}
              className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-5 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors inline-block"
            >
              [ TAKE THIS QUIZ → ]
            </Link>
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="border-x border-b border-rule">
            <div className="border-b border-rule px-5 py-2 bg-plate">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                TOP SCORES / LEADERBOARD
              </span>
            </div>
            <div className="divide-y divide-rule-faint">
              {leaderboard.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <span className="font-display text-hazard w-6 text-center" style={{ fontSize: "1rem" }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 font-terminal text-[0.65rem] uppercase tracking-wide text-ink">
                    {entry.name.toUpperCase()}
                  </span>
                  <span className="font-terminal text-[0.65rem] uppercase tracking-widest font-bold text-hazard tabular-nums">
                    {Math.round((entry.score / entry.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
