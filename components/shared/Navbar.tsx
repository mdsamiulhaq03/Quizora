"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`font-terminal text-[0.65rem] uppercase tracking-widest transition-colors ${
          active ? "text-hazard" : "text-ink-muted hover:text-ink"
        }`}
      >
        {active ? `[ ${label} ]` : label}
      </Link>
    );
  };

  return (
    <nav className="bg-paper border-b border-rule sticky top-0 z-40 ind-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-hazard flex items-center justify-center">
              <span className="text-white font-display text-xs font-bold leading-none">Q</span>
            </div>
            <span className="font-display text-sm uppercase tracking-widest text-ink">
              QUIZORA
            </span>
            <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted hidden sm:block">
              / SYS-001
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {session?.user ? (
              <>
                {navLink("/dashboard", "Dashboard")}
                {navLink("/library", "Library")}
                {navLink("/review", "Review")}

                {/* Theme toggle */}
                <button
                  onClick={toggle}
                  className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-hazard border border-rule-faint px-2 py-1 transition-colors"
                >
                  {theme === "dark" ? "[ ◐ LIGHT ]" : "[ ◑ DARK ]"}
                </button>

                <Link
                  href="/upload"
                  className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
                >
                  [ UPLOAD PDF ]
                </Link>

                {/* Avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
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
                      <span className="font-terminal text-xs text-ink-muted">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    )}
                    <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                      ▾
                    </span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-0 w-44 bg-paper border border-rule z-50">
                      <div className="border-b border-rule-faint px-3 py-2">
                        <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 font-terminal text-[0.65rem] uppercase tracking-widest text-ink hover:bg-plate hover:text-hazard transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        PROFILE
                      </Link>
                      <div className="border-t border-rule-faint" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-3 py-2 font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:bg-plate transition-colors"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/upload"
                  className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
                >
                  TRY FREE
                </Link>

                {/* Theme toggle */}
                <button
                  onClick={toggle}
                  className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted hover:text-hazard border border-rule-faint px-2 py-1 transition-colors"
                >
                  {theme === "dark" ? "[ ◐ LIGHT ]" : "[ ◑ DARK ]"}
                </button>

                <Link
                  href="/login"
                  className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
                >
                  [ SIGN IN ]
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
