import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Archivo_Black } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { auth } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUIZORA — PDF-TO-MCQ LEARNING ENGINE",
  description:
    "Upload PDFs and generate adaptive quizzes powered by Groq AI. Track your progress with spaced repetition.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      {/* Anti-FOUC: set theme before React hydrates */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t||p);})();`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${archivo.variable} ${jetbrains.variable} font-sans antialiased bg-paper text-ink`}
      >
        <SessionProvider session={session}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
