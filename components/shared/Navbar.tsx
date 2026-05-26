"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <motion.div whileTap={{ scale: 0.95 }}>
        <Link
          href={href}
          className={`font-terminal text-[0.65rem] uppercase tracking-widest transition-colors ${
            active ? "text-hazard" : "text-ink-muted hover:text-ink"
          }`}
        >
          {active ? `[ ${label} ]` : label}
        </Link>
      </motion.div>
    );
  };

  return (
    <nav className="bg-paper border-b border-rule sticky top-0 z-40 ind-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-6 h-6 bg-hazard flex items-center justify-center"
            >
              <span className="text-white font-display text-xs font-bold leading-none">Q</span>
            </motion.div>
            <span className="font-display text-sm uppercase tracking-widest text-ink">QUIZORA</span>
            <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted hidden sm:block">
              / SYS-001
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {session?.user ? (
              <>
                {navLink("/dashboard", "Dashboard")}
                {navLink("/library", "Library")}
                {navLink("/review", "Review")}

                <motion.button
                  onClick={toggle}
                  whileTap={{ scale: 0.95 }}
                  className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-hazard border border-rule-faint px-2 py-1 transition-colors"
                >
                  {theme === "dark" ? "[ LIGHT ]" : "[ DARK ]"}
                </motion.button>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/upload"
                    className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
                  >
                    [ UPLOAD PDF ]
                  </Link>
                </motion.div>

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setMenuOpen(!menuOpen)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 border border-rule-faint px-2 py-1 hover:border-rule transition-colors"
                    aria-label="User menu"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "User"}
                        width={20}
                        height={20}
                        className="grayscale"
                        style={{ borderRadius: "0 !important" }}
                      />
                    ) : (
                      <span className="w-5 h-5 bg-hazard flex items-center justify-center font-terminal text-[0.6rem] text-white">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    )}
                    <motion.span
                      animate={{ rotate: menuOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted inline-block"
                    >
                      ▾
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{ transformOrigin: "top" }}
                        className="absolute right-0 top-full mt-1 w-48 bg-paper border border-rule z-50"
                      >
                        <div className="border-b border-rule-faint px-3 py-2">
                          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted truncate">
                            {session.user.email}
                          </p>
                        </div>
                        {[
                          { href: "/profile", label: "Profile" },
                          { href: "/quiz-history", label: "Quiz History" },
                        ].map(({ href, label }) => (
                          <motion.div key={href} whileHover={{ x: 3 }} transition={{ duration: 0.1 }}>
                            <Link
                              href={href}
                              className="block px-3 py-2.5 font-terminal text-[0.65rem] uppercase tracking-widest text-ink hover:text-hazard transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="border-t border-rule-faint" />
                        <motion.button
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.1 }}
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left px-3 py-2.5 font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:bg-plate transition-colors"
                        >
                          Sign Out
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/upload"
                    className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
                  >
                    TRY FREE
                  </Link>
                </motion.div>

                <motion.button
                  onClick={toggle}
                  whileTap={{ scale: 0.95 }}
                  className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-hazard border border-rule-faint px-2 py-1 transition-colors"
                >
                  {theme === "dark" ? "[ LIGHT ]" : "[ DARK ]"}
                </motion.button>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/login"
                    className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
                  >
                    [ SIGN IN ]
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted border border-rule-faint px-2 py-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? "[ CLOSE ]" : "[ MENU ]"}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden border-t border-rule bg-plate overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {session?.user ? (
                <>
                  <div className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted border-b border-rule-faint pb-3">
                    {session.user.email}
                  </div>
                  {[
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/library", label: "Library" },
                    { href: "/review", label: "Review" },
                    { href: "/upload", label: "Upload PDF" },
                    { href: "/profile", label: "Profile" },
                    { href: "/quiz-history", label: "Quiz History" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="font-terminal text-[0.7rem] uppercase tracking-widest text-ink hover:text-hazard transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="font-terminal text-[0.7rem] uppercase tracking-widest text-hazard text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/upload" className="font-terminal text-[0.7rem] uppercase tracking-widest text-ink hover:text-hazard transition-colors">Try Free</Link>
                  <Link href="/login" className="font-terminal text-[0.7rem] uppercase tracking-widest text-hazard">Sign In</Link>
                  <Link href="/register" className="font-terminal text-[0.7rem] uppercase tracking-widest text-ink hover:text-hazard transition-colors">Register</Link>
                </>
              )}
              <button
                onClick={toggle}
                className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted text-left"
              >
                {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
