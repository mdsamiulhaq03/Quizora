"use client";

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";

interface WrongAnswer {
  answer: { questionId: string; selectedAnswer: string; isCorrect: boolean };
  question: Question;
}

interface TopicEntry {
  topic: string;
  correct: number;
  total: number;
}

interface Props {
  attemptId: string;
  score: number;
  total: number;
  pct: number;
  grade: string;
  gradeColor: string;
  quizId: string;
  quizTitle: string;
  isGuest: boolean;
  wrongAnswers: WrongAnswer[];
  topics: TopicEntry[];
  date: string;
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v) + suffix);
  useEffect(() => {
    const controls = animate(count, target, { duration: 1.1, ease: "easeOut", delay: 0.3 });
    return controls.stop;
  }, [count, target]);
  return <motion.span>{rounded}</motion.span>;
}

function TopicBar({ topic, correct, total }: TopicEntry) {
  const p = Math.round((correct / total) * 100);
  const barColor = p >= 80 ? "#4AF626" : p >= 60 ? "#F5A623" : "#E61919";
  return (
    <div className="px-5 py-3">
      <div className="flex justify-between mb-1.5">
        <span className="font-terminal text-xs uppercase tracking-wide text-ink">{topic}</span>
        <span className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted tabular-nums">
          {correct}/{total} · {p}%
        </span>
      </div>
      <div className="w-full bg-plate-alt h-1 overflow-hidden">
        <motion.div
          className="h-1 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: barColor, width: `${p}%`, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

const wrongStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const wrongItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
};

export default function ResultsClient({
  attemptId,
  score,
  total,
  pct,
  grade,
  gradeColor,
  quizId,
  quizTitle,
  isGuest,
  wrongAnswers,
  topics,
  date,
}: Props) {
  const [expandedWrong, setExpandedWrong] = useState<string | null>(null);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-0">

      {/* Score panel */}
      <motion.div variants={fadeUp} className="border border-rule">
        <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            ATTEMPT / {attemptId.slice(-6).toUpperCase()}
          </span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            {date}
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] divide-x divide-rule">
          {/* Grade block */}
          <div className="p-8 flex flex-col items-center justify-center min-w-[140px]">
            <motion.p
              className={`font-display leading-none ${gradeColor}`}
              style={{ fontSize: "clamp(4rem, 10vw, 6rem)", letterSpacing: "-0.04em" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
            >
              {grade}
            </motion.p>
            <p className={`font-display leading-none ${gradeColor}`} style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
              <CountUp target={pct} suffix="%" />
            </p>
          </div>

          {/* Quiz info */}
          <div className="p-5">
            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-2">
              QUIZ TITLE
            </p>
            <p className="font-display uppercase text-ink mb-4" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", letterSpacing: "-0.01em" }}>
              {quizTitle}
            </p>
            <div className="ind-rule mb-4" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                { label: "CORRECT", value: <CountUp target={score} />, color: "text-green-500" },
                { label: "TOTAL", value: total, color: "text-ink" },
                { label: "WRONG", value: wrongAnswers.length, color: "text-hazard" },
                { label: "ACCURACY", value: <CountUp target={pct} suffix="%" />, color: gradeColor },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">{label}</p>
                  <p className={`font-terminal text-base font-bold tabular-nums ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isGuest && (
          <div className="border-t border-rule px-5 py-3 flex flex-wrap gap-2 bg-plate">
            {[
              { href: `/quiz/${quizId}`, label: "[ RETAKE ]", primary: true },
              { href: "/review", label: "[ REVIEW WEAK ]", primary: false },
              { href: "/dashboard", label: "[ DASHBOARD ]", primary: false },
            ].map(({ href, label, primary }) => (
              <motion.div key={href} whileTap={{ scale: 0.97 }}>
                <Link
                  href={href}
                  className={`font-terminal text-[0.65rem] uppercase tracking-widest px-4 py-2 border transition-colors inline-block ${
                    primary
                      ? "bg-hazard text-white border-hazard hover:bg-paper hover:text-hazard"
                      : "border-rule text-ink hover:border-hazard hover:text-hazard"
                  }`}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Topic breakdown */}
      {topics.length > 0 && (
        <motion.div variants={fadeUp} className="border-x border-b border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              TOPIC BREAKDOWN
            </span>
          </div>
          <div className="divide-y divide-rule-faint">
            {topics.map((t) => <TopicBar key={t.topic} {...t} />)}
          </div>
        </motion.div>
      )}

      {/* Wrong answers */}
      {wrongAnswers.length > 0 && (
        <motion.div variants={fadeUp} className="border-x border-b border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate flex items-center justify-between">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              QUESTIONS TO REVIEW
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              {wrongAnswers.length} FLAGGED
            </span>
          </div>
          <motion.div
            className="divide-y divide-rule-faint"
            variants={wrongStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {wrongAnswers.map(({ answer, question }) => (
              <motion.div
                key={answer.questionId}
                variants={wrongItem}
                className="cursor-pointer"
                onClick={() =>
                  setExpandedWrong(
                    expandedWrong === answer.questionId ? null : answer.questionId
                  )
                }
              >
                <div className="px-5 py-4 hover:bg-plate transition-colors">
                  <p className="font-terminal text-sm uppercase tracking-wide text-ink mb-2 leading-relaxed">
                    {question.question}
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <span className="mono-label">YOURS: </span>
                      <span className="font-terminal text-xs text-hazard uppercase tracking-wide">
                        {answer.selectedAnswer || "(NONE)"}
                      </span>
                    </div>
                    <div>
                      <span className="mono-label">CORRECT: </span>
                      <span className="font-terminal text-xs text-green-400 uppercase tracking-wide">
                        {question.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedWrong === answer.questionId && question.explanation && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="font-terminal text-xs uppercase tracking-wide text-ink leading-relaxed mt-3 overflow-hidden"
                      >
                        {question.explanation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Guest upsell */}
      {isGuest && (
        <motion.div variants={fadeUp} className="border-x border-b border-rule bg-plate">
          <div className="px-5 py-6 text-center">
            <p className="font-display uppercase text-ink mb-2" style={{ fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
              SAVE YOUR PROGRESS
            </p>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-5">
              CREATE A FREE ACCOUNT TO TRACK HISTORY, REVIEW WEAK QUESTIONS, AND MORE.
            </p>
            <div className="flex gap-2 justify-center">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-6 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors inline-block"
                >
                  [ CREATE FREE ACCOUNT ]
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link
                  href="/upload"
                  className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-6 py-2.5 hover:border-hazard hover:text-hazard transition-colors inline-block"
                >
                  [ TRY ANOTHER PDF ]
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
