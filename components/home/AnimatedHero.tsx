"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function AnimatedHero() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="py-16 lg:py-24">
      <motion.div variants={item}>
        <h1
          className="font-display uppercase leading-none text-ink"
          style={{ fontSize: "clamp(3.2rem, 9vw, 9rem)", letterSpacing: "-0.03em" }}
        >
          TURN ANY PDF
        </h1>
      </motion.div>

      <motion.div variants={item}>
        <h1
          className="font-display uppercase leading-none text-hazard hazard-glow mb-5"
          style={{ fontSize: "clamp(3.2rem, 9vw, 9rem)", letterSpacing: "-0.03em" }}
        >
          INTO QUIZZES.
        </h1>
      </motion.div>

      <motion.div variants={item} className="ind-rule-accent mb-8 max-w-2xl" />

      <motion.p
        variants={item}
        className="font-terminal text-sm text-ink-muted max-w-xl mb-10 leading-relaxed tracking-wide uppercase"
      >
        Upload a document. Get AI-generated questions in seconds.
        Track performance with spaced repetition and actually remember what you study.
      </motion.p>

      <motion.div variants={item} className="flex items-center flex-wrap">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            href="/upload"
            className="font-terminal text-sm uppercase tracking-widest bg-hazard text-white px-8 py-4 border-2 border-hazard hover:bg-paper hover:text-hazard font-bold transition-colors inline-block"
          >
            [ TRY FREE — NO SIGN UP ]
          </Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            href="/login"
            className="font-terminal text-sm uppercase tracking-widest bg-paper text-ink px-8 py-4 border-2 border-rule hover:border-hazard hover:text-hazard transition-colors inline-block"
          >
            [ SIGN IN ]
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        variants={item}
        className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-4"
      >
        NO CREDIT CARD REQUIRED · FREE FOREVER FOR BASIC USE
      </motion.p>
    </motion.div>
  );
}
