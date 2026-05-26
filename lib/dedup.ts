import levenshtein from "fast-levenshtein";
import type { Question } from "./types";

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = levenshtein.get(a.toLowerCase(), b.toLowerCase());
  return 1 - dist / maxLen;
}

export function deduplicateQuestions(questions: Question[]): Question[] {
  const seen: Question[] = [];

  for (const q of questions) {
    const isDuplicate = seen.some(
      (s) => similarity(s.question, q.question) > 0.85
    );
    if (!isDuplicate) seen.push(q);
  }

  return seen;
}
