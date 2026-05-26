import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProgress } from "@/app/actions/getProgress";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import User from "@/lib/models/User";
import Navbar from "@/components/shared/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import StreakTracker from "@/components/dashboard/StreakTracker";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import WeakQuestionsPanel from "@/components/dashboard/WeakQuestionsPanel";
import RecentQuizzes from "@/components/dashboard/RecentQuizzes";
import ScoreLineChart from "@/components/charts/ScoreLineChart";
import TopicBarChart from "@/components/charts/TopicBarChart";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [progress, weakQuestions, user] = await Promise.all([
    getProgress(),
    (async () => {
      await dbConnect();
      return WeakQuestion.find({ userId: session.user.id })
        .sort({ nextReviewAt: 1 })
        .limit(20)
        .lean();
    })(),
    (async () => {
      await dbConnect();
      return User.findOne({ email: session.user.email }).lean();
    })(),
  ]);

  const stats = [
    {
      title: "Total Quizzes",
      value: progress?.totalQuizzes ?? 0,
      subtitle: "All time",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: "Average Score",
      value: `${progress?.averageScore ?? 0}%`,
      subtitle: "Across all attempts",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Due for Review",
      value: progress?.weakQuestionsDue ?? 0,
      subtitle: "Weak questions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: (progress?.weakQuestionsDue ?? 0) > 0 ? "text-red-600" : "text-ink",
    },
    {
      title: "Best Score",
      value: `${progress?.bestScore ?? 0}%`,
      subtitle: "Personal record",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Telemetry strip */}
        <div className="border-b border-rule-faint pb-2 mb-6 flex items-center justify-between">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            OPERATOR: {session.user.email}
          </span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}
          </span>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted block mb-1">
              PERFORMANCE DASHBOARD
            </span>
            <h1
              className="font-display uppercase text-ink leading-none"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.03em" }}
            >
              {session.user.name?.split(" ")[0]?.toUpperCase()}&apos;S PROGRESS
            </h1>
          </div>
          <Link
            href="/upload"
            className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-5 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ + UPLOAD PDF ]
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-px bg-rule border border-rule">
          {stats.map((s) => (
            <StatsCard key={s.title} {...s} color={s.color} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <ScoreLineChart data={progress?.scoreHistory ?? []} />
            <TopicBarChart data={progress?.topicWeakness ?? []} />
            <ActivityHeatmap data={[]} />
            <RecentQuizzes quizzes={(progress?.recentQuizzes ?? []).map(q => ({ ...q, completedAt: new Date(q.completedAt) }))} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <StreakTracker
              streak={(user as { streak?: number } | null)?.streak ?? 0}
              freezeUsed={(user as { streakFreezeUsed?: boolean } | null)?.streakFreezeUsed ?? false}
            />
            <WeakQuestionsPanel
              questions={weakQuestions.map((q) => ({
                _id: q._id.toString(),
                question: q.question,
                topic: q.topic,
                timesWrong: q.timesWrong,
                nextReviewAt: q.nextReviewAt,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
