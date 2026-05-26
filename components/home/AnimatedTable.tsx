"use client";

import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const row = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
};

export default function AnimatedTable({ rows }: { rows: string[][] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {rows.map(([feat, guest, auth]) => (
        <motion.div
          key={feat}
          variants={row}
          className="grid grid-cols-3 border-b border-rule-faint"
        >
          <div className="px-6 py-3 border-r border-rule-faint">
            <span className="font-terminal text-xs uppercase tracking-wide text-ink">{feat}</span>
          </div>
          <div className="px-6 py-3 text-center border-r border-rule-faint">
            <span className="font-terminal text-xs text-ink-muted">{guest}</span>
          </div>
          <div className="px-6 py-3 text-center bg-plate">
            <span className={`font-terminal text-xs font-bold ${auth === "—" ? "text-ink-muted" : "text-hazard"}`}>
              {auth}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
