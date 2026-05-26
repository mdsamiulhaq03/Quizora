"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  flagged: boolean;
  onToggle: () => void;
}

export default function FlagButton({ flagged, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      title={flagged ? "Remove flag" : "Flag for review"}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`font-terminal text-[0.6rem] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
        flagged
          ? "border-hazard text-hazard bg-hazard/10"
          : "border-rule text-ink-muted hover:border-hazard hover:text-hazard"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={flagged ? "flagged" : "unflagged"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12 }}
          className="inline-block"
        >
          {flagged ? "[ FLAGGED ]" : "[ FLAG ]"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
