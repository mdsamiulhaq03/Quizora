"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  name: string;
  email: string;
  image: string | null;
  memberSince: string;
  streak: number;
  freezeAvailable: boolean;
  children: ReactNode;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const panel = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function ProfileClient({ name, email, image, memberSince, streak, freezeAvailable, children }: Props) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-0">

      {/* Identity panel */}
      <motion.div variants={panel} className="border border-rule">
        <div className="border-b border-rule px-5 py-2 bg-plate flex items-center justify-between">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            OPERATOR PROFILE
          </span>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 bg-hazard inline-block" />
            AUTHENTICATED
          </motion.span>
        </div>
        <div className="px-5 py-5 flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
          >
            {image ? (
              <Image
                src={image}
                alt="avatar"
                width={56}
                height={56}
                className="grayscale border border-rule"
                style={{ borderRadius: "0 !important" }}
              />
            ) : (
              <div className="w-14 h-14 bg-hazard flex items-center justify-center border border-rule shrink-0">
                <span className="font-display text-white text-xl">{name?.[0]?.toUpperCase() || "U"}</span>
              </div>
            )}
          </motion.div>
          <div>
            <p className="font-display uppercase text-ink leading-none" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
              {name?.toUpperCase()}
            </p>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mt-1">{email}</p>
            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
              MEMBER SINCE: {memberSince}
            </p>
          </div>
          {/* Streak + freeze */}
          <div className="ml-auto flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-hazard leading-none" style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>
                {streak}
              </span>
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                DAY STREAK
              </span>
            </div>
            <span className={`font-terminal text-[0.55rem] uppercase tracking-widest px-2 py-0.5 border ${
              freezeAvailable
                ? "border-green-600 text-green-500"
                : "border-rule text-ink-muted"
            }`}>
              {freezeAvailable ? "FREEZE READY" : "FREEZE USED"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Account actions */}
      <motion.div variants={panel} className="border-x border-b border-rule">
        <div className="border-b border-rule px-5 py-2 bg-plate">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">ACCOUNT CONTROLS</span>
        </div>
        <div className="px-5 py-4 flex flex-wrap gap-2">
          {children}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/quiz-history"
              className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-5 py-2.5 hover:border-hazard hover:text-hazard transition-colors inline-block"
            >
              [ QUIZ HISTORY ]
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Data panel */}
      <motion.div variants={panel} className="border-x border-b border-rule">
        <div className="border-b border-rule px-5 py-2 bg-plate">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">DATA AND PRIVACY</span>
        </div>
        <div className="px-5 py-4">
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-4">
            EXPORT OR DELETE ALL YOUR DATA AT ANY TIME.
          </p>
          <motion.div whileTap={{ scale: 0.97 }}>
            <a
              href="/api/export"
              className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-5 py-2.5 hover:border-hazard hover:text-hazard transition-colors inline-block"
            >
              [ EXPORT DATA ]
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

