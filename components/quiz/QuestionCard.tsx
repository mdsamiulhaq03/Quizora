"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  selectedAnswer: string | null;
  submitted: boolean;
  onSelect: (answer: string) => void;
  questionNumber: number;
  total: number;
}

const optionLabels = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selectedAnswer,
  submitted,
  onSelect,
  questionNumber,
  total,
}: Props) {
  const isCorrect = submitted && selectedAnswer === question.correctAnswer;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="bg-plate border border-rule ind-surface"
      >
        {/* Header bar */}
        <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
            [ {question.topic} ]
          </span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted tabular-nums">
            {String(questionNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Question text */}
        <div className="px-5 py-5">
          <p className="font-terminal text-sm text-ink leading-relaxed tracking-wide uppercase">
            {question.question}
          </p>
        </div>

        <div className="ind-rule" />

        {/* Options — MCQ */}
        {question.type === "mcq" && question.options && (
          <div className="divide-y divide-rule-faint">
            {optionLabels.map((label) => {
              const text = question.options![label as keyof typeof question.options];
              if (!text) return null;
              const isSelected = selectedAnswer === label;
              const showCorrect = submitted && label === question.correctAnswer;
              const showWrong = submitted && isSelected && label !== question.correctAnswer;

              return (
                <button
                  key={label}
                  onClick={() => !submitted && onSelect(label)}
                  disabled={submitted}
                  className={`w-full text-left px-5 py-3.5 font-terminal text-xs uppercase tracking-wide transition-colors ${
                    showCorrect
                      ? "bg-green-950 text-green-400 border-l-2 border-green-500"
                      : showWrong
                      ? "bg-red-950 text-hazard border-l-2 border-hazard"
                      : isSelected
                      ? "bg-hazard/10 text-hazard border-l-2 border-hazard"
                      : submitted
                      ? "bg-plate text-ink-muted cursor-default"
                      : "bg-plate text-ink hover:bg-plate-alt hover:text-hazard cursor-pointer"
                  }`}
                >
                  <span className="font-display mr-3 text-[0.7rem]">{label}.</span>
                  {text}
                </button>
              );
            })}
          </div>
        )}

        {/* Options — True/False */}
        {question.type === "truefalse" && (
          <div className="grid grid-cols-2 divide-x divide-rule-faint">
            {["True", "False"].map((opt) => {
              const isSelected = selectedAnswer === opt;
              const showCorrect = submitted && opt === question.correctAnswer;
              const showWrong = submitted && isSelected && opt !== question.correctAnswer;
              return (
                <button
                  key={opt}
                  onClick={() => !submitted && onSelect(opt)}
                  disabled={submitted}
                  className={`py-4 font-terminal text-xs uppercase tracking-widest transition-colors ${
                    showCorrect
                      ? "bg-green-950 text-green-400"
                      : showWrong
                      ? "bg-red-950 text-hazard"
                      : isSelected
                      ? "bg-hazard/10 text-hazard"
                      : submitted
                      ? "bg-plate text-ink-muted cursor-default"
                      : "bg-plate text-ink hover:bg-plate-alt hover:text-hazard cursor-pointer"
                  }`}
                >
                  {opt === "True" ? "[ ✓ TRUE ]" : "[ ✗ FALSE ]"}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in blank */}
        {question.type === "fillintheblank" && (
          <div className="px-5 py-4">
            <input
              type="text"
              disabled={submitted}
              value={selectedAnswer || ""}
              onChange={(e) => !submitted && onSelect(e.target.value)}
              placeholder="TYPE ANSWER HERE..."
              className="w-full"
            />
          </div>
        )}

        {/* Result feedback */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`border-t border-rule px-5 py-4 ${
              isCorrect ? "bg-green-950" : "bg-red-950/40"
            }`}
          >
            <p className={`font-terminal text-xs uppercase tracking-widest font-bold mb-1 ${
              isCorrect ? "text-green-400" : "text-hazard"
            }`}>
              {isCorrect ? "[ ✓ CORRECT ]" : `[ ✗ INCORRECT — ANSWER: ${question.correctAnswer} ]`}
            </p>
            {question.explanation && (
              <p className="font-terminal text-[0.65rem] text-ink-muted leading-relaxed tracking-wide uppercase">
                {question.explanation}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
