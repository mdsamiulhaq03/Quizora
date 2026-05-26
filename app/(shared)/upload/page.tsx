"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import GuestBanner from "@/components/shared/GuestBanner";
import TruncationWarning from "@/components/shared/TruncationWarning";
import { uploadPdf } from "@/app/actions/uploadPdf";

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "mcq" | "truefalse" | "fillintheblank";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(["mcq"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateQuizId, setDuplicateQuizId] = useState<string | null>(null);
  const [duplicateDate, setDuplicateDate] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setWordCount(Math.floor(f.size / 6));
  };

  const toggleType = (type: QuestionType) => {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent, forceNew = false) => {
    e.preventDefault();
    if (!file || questionTypes.length === 0) return;

    setLoading(true);
    setError(null);
    setDuplicateQuizId(null);
    setDuplicateDate(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("difficulty", difficulty);
    formData.append("questionCount", questionCount.toString());
    questionTypes.forEach((t) => formData.append("questionTypes", t));
    if (forceNew) formData.append("forceNew", "true");

    const result = await uploadPdf(formData);

    if (!result.success) {
      setError(result.error || "Upload failed");
      setLoading(false);
      return;
    }

    if (result.duplicate && result.quizId) {
      // Show duplicate options instead of silently redirecting
      setDuplicateQuizId(result.quizId);
      setDuplicateDate(result.duplicateDate ?? null);
      setLoading(false);
      return;
    }

    if (result.quizId) {
      if (!session?.user) sessionStorage.setItem("guestQuizId", result.quizId);
      router.push(`/quiz/${result.quizId}`);
    }
  };

  const isGuest = status === "unauthenticated";

  const diffOptions: { value: Difficulty; label: string }[] = [
    { value: "easy",   label: "EASY" },
    { value: "medium", label: "MEDIUM" },
    { value: "hard",   label: "HARD" },
  ];

  const typeOptions: { value: QuestionType; label: string }[] = [
    { value: "mcq",            label: "MULTIPLE CHOICE" },
    { value: "truefalse",      label: "TRUE / FALSE" },
    { value: "fillintheblank", label: "FILL IN BLANK" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {isGuest && (
          <div className="mb-0">
            <GuestBanner />
          </div>
        )}

        <div className="border border-rule">
          {/* Title bar */}
          <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              INGEST / GENERATE
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              ● ONLINE
            </span>
          </div>

          <div className="px-5 py-6">
            <h1
              className="font-display uppercase text-ink leading-none mb-1"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "-0.03em" }}
            >
              UPLOAD PDF
            </h1>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-6">
              CONTENT IS EXTRACTED AND SENT TO GROQ FOR QUESTION GENERATION
            </p>

            {error && (
              <div className="mb-5">
                <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-red-500">{error}</p>
              </div>
            )}

            {duplicateQuizId && (
              <div className="mb-5 border border-rule bg-plate">
                <div className="border-b border-rule px-4 py-2">
                  <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
                    DUPLICATE DETECTED
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="font-terminal text-xs uppercase tracking-wide text-ink mb-1">
                    THIS PDF WAS ALREADY UPLOADED
                    {duplicateDate ? ` ON ${duplicateDate.toUpperCase()}` : ""}.
                  </p>
                  <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-4">
                    TAKE THE EXISTING QUIZ OR GENERATE A FRESH SET OF QUESTIONS.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/quiz/${duplicateQuizId}`)}
                      className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
                    >
                      [ TAKE EXISTING QUIZ ]
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
                      className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-4 py-2.5 hover:border-hazard hover:text-hazard transition-colors"
                    >
                      [ GENERATE NEW QUESTIONS ]
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-0">

              {/* File drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-rule hover:border-hazard transition-colors p-8 text-center cursor-pointer"
                style={{ borderRadius: "0 !important" }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <p className="font-terminal text-xs uppercase tracking-widest text-hazard mb-1">
                      ● FILE LOADED
                    </p>
                    <p className="font-display uppercase text-ink" style={{ fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
                      {file.name.toUpperCase()}
                    </p>
                    <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-ink-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="font-terminal text-xs uppercase tracking-widest text-ink">
                      CLICK TO SELECT PDF
                    </p>
                    <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
                      MAX 10MB
                    </p>
                  </div>
                )}
              </div>

              {wordCount > 2000 && (
                <div className="mt-2">
                  <TruncationWarning wordCount={wordCount} />
                </div>
              )}

              {/* Difficulty */}
              <div className="border-t border-rule pt-5 mt-5">
                <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-3">
                  DIFFICULTY LEVEL
                </p>
                <div className="grid grid-cols-3 divide-x divide-rule border border-rule">
                  {diffOptions.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`py-2.5 font-terminal text-[0.65rem] uppercase tracking-widest transition-colors ${
                        difficulty === d.value
                          ? "bg-hazard text-white"
                          : "bg-paper text-ink-muted hover:text-hazard hover:bg-plate"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question count */}
              <div className="pt-5">
                <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-3">
                  QUESTION COUNT
                </p>
                <div className="grid grid-cols-4 divide-x divide-rule border border-rule">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuestionCount(n)}
                      className={`py-2.5 font-display text-sm uppercase tracking-wide transition-colors ${
                        questionCount === n
                          ? "bg-hazard text-white"
                          : "bg-paper text-ink-muted hover:text-hazard hover:bg-plate"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question types */}
              <div className="pt-5">
                <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-3">
                  QUESTION TYPES
                </p>
                <div className="grid grid-cols-3 divide-x divide-rule border border-rule">
                  {typeOptions.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => toggleType(t.value)}
                      className={`py-2.5 font-terminal text-[0.6rem] uppercase tracking-widest transition-colors ${
                        questionTypes.includes(t.value)
                          ? "bg-hazard text-white"
                          : "bg-paper text-ink-muted hover:text-hazard hover:bg-plate"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!file || loading || questionTypes.length === 0}
                  className="w-full font-terminal text-[0.75rem] uppercase tracking-widest py-4 border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-hazard text-white border-hazard hover:bg-paper hover:text-hazard"
                >
                  {loading ? (
                    <span className="flex flex-col items-center gap-1.5">
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        [ GENERATING QUIZ... ]
                      </span>
                      <span className="font-terminal text-[0.55rem] uppercase tracking-widest opacity-70">
                        EXTRACTING TEXT · CALLING AI · THIS TAKES 10–30 SECONDS
                      </span>
                    </span>
                  ) : (
                    "[ GENERATE QUIZ → ]"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
