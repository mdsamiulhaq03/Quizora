import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";
import { auth } from "@/lib/auth";
import Navbar from "@/components/shared/Navbar";
import ResultsClient from "@/components/results/ResultsClient";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const session = await auth();

  await dbConnect();
  const attempt = await Attempt.findById(attemptId).lean();
  if (!attempt) notFound();

  const quiz = await Quiz.findById(attempt.quizId).lean();
  if (!quiz) notFound();

  const isGuest = !session?.user;
  const score = attempt.score;
  const total = attempt.total;
  const pct = Math.round((score / total) * 100);

  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor = pct >= 80 ? "text-green-500" : pct >= 60 ? "text-yellow-500" : "text-hazard";

  const wrongAnswers = attempt.answers
    .filter((a) => !a.isCorrect)
    .map((a) => {
      const q = quiz.questions.find((q) => q.id === a.questionId);
      return { answer: a, question: q };
    })
    .filter((x) => x.question) as {
      answer: (typeof attempt.answers)[0];
      question: NonNullable<(typeof quiz.questions)[0]>;
    }[];

  const topicMapObj: Record<string, { correct: number; total: number }> = {};
  for (const ans of attempt.answers) {
    const q = quiz.questions.find((q) => q.id === ans.questionId);
    const topic = q?.topic || "GENERAL";
    if (!topicMapObj[topic]) topicMapObj[topic] = { correct: 0, total: 0 };
    topicMapObj[topic].total++;
    if (ans.isCorrect) topicMapObj[topic].correct++;
  }
  const topics = Object.entries(topicMapObj).map(([topic, { correct, total: t }]) => ({
    topic,
    correct,
    total: t,
  }));

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <ResultsClient
          attemptId={attemptId}
          score={score}
          total={total}
          pct={pct}
          grade={grade}
          gradeColor={gradeColor}
          quizId={quiz._id.toString()}
          quizTitle={quiz.title}
          isGuest={isGuest}
          wrongAnswers={wrongAnswers.map(({ answer, question }) => ({
            answer: {
              questionId: answer.questionId,
              selectedAnswer: answer.selectedAnswer,
              isCorrect: answer.isCorrect,
            },
            question,
          }))}
          topics={topics}
          date={date}
        />
      </div>
    </div>
  );
}
