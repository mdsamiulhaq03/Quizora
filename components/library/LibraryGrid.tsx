"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePdf } from "@/app/actions/deletePdf";

interface PDF {
  _id: string;
  filename: string;
  wordCount: number;
  uploadedAt: string;
  topics: string[];
  wasTruncated: boolean;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const card = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function LibraryGrid({ pdfs: initialPdfs }: { pdfs: PDF[] }) {
  const [pdfs, setPdfs] = useState(initialPdfs);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (pdfId: string) => {
    setDeletingId(pdfId);
    const result = await deletePdf(pdfId);
    if (result.success) {
      setPdfs((prev) => prev.filter((p) => p._id !== pdfId));
      router.refresh();
    }
    setDeletingId(null);
    setConfirmId(null);
  };

  if (pdfs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-rule bg-plate px-6 py-14 text-center"
      >
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-8 h-8 border border-rule-faint mx-auto mb-4 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </motion.div>
        <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-3">
          NO DOCUMENTS IN ARCHIVE.
        </p>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link href="/upload" className="font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:underline">
            [ UPLOAD YOUR FIRST PDF → ]
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {pdfs.map((pdf) => (
          <motion.div
            key={pdf._id}
            variants={card}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
            className="bg-plate p-5 ind-surface"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-hazard shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">PDF</span>
              </div>
              {pdf.wasTruncated && (
                <span className="font-terminal text-[0.55rem] uppercase tracking-widest border border-rule text-ink-muted px-1.5 py-0.5">
                  TRUNCATED
                </span>
              )}
            </div>

            <div className="ind-rule mb-3" />

            <h3 className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink truncate mb-1">
              {pdf.filename}
            </h3>
            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              {pdf.wordCount.toLocaleString()} WORDS ·{" "}
              {new Date(pdf.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </p>

            {pdf.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {pdf.topics.slice(0, 3).map((t) => (
                  <span key={t} className="font-terminal text-[0.55rem] uppercase tracking-widest border border-rule-faint text-ink-muted px-1.5 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                <Link
                  href={`/upload?pdfId=${pdf._id}`}
                  className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink w-full py-2 text-center block hover:border-hazard hover:text-hazard transition-colors"
                >
                  [ NEW QUIZ → ]
                </Link>
              </motion.div>

              {/* Delete button / confirm */}
              <AnimatePresence mode="wait">
                {confirmId === pdf._id ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex gap-1 overflow-hidden"
                  >
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      disabled={deletingId === pdf._id}
                      onClick={() => handleDelete(pdf._id)}
                      className="font-terminal text-[0.6rem] uppercase tracking-widest border border-hazard bg-hazard text-white px-2 py-2 hover:bg-paper hover:text-hazard transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {deletingId === pdf._id ? "..." : "YES"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setConfirmId(null)}
                      className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-2 py-2 hover:border-rule hover:text-ink transition-colors"
                    >
                      NO
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="delete"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setConfirmId(pdf._id)}
                    className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-3 py-2 hover:border-hazard hover:text-hazard transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
