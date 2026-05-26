"use client";

import { motion } from "framer-motion";

interface Feature {
  id: string;
  code: string;
  title: string;
  desc: string;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function AnimatedFeatures({ features }: { features: Feature[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {features.map((f, i) => (
        <motion.div
          key={f.id}
          variants={item}
          whileHover={{ backgroundColor: "var(--surface-alt)" }}
          transition={{ duration: 0.15 }}
          className={`p-6 bg-plate ind-surface border-r border-rule-faint ${
            i === features.length - 1 ? "border-r-0" : ""
          }`}
        >
          <div className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-4">
            {f.id} / {f.code}
          </div>
          <div className="ind-rule-accent mb-4" />
          <h3
            className="font-display uppercase text-ink leading-tight mb-3"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", letterSpacing: "-0.02em" }}
          >
            {f.title}
          </h3>
          <p className="font-terminal text-xs text-ink-muted leading-relaxed tracking-wide uppercase">
            {f.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

