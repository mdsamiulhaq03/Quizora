"use server";

import Groq from "groq-sdk";
import type { Question, Difficulty, QuestionType } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GenerateParams {
  truncatedText: string;
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
}

function buildPrompt(
  type: QuestionType,
  count: number,
  difficulty: Difficulty,
  text: string
): string {
  if (type === "mcq") {
    return `You are an expert educator. Generate ${count} multiple choice questions at ${difficulty} difficulty from the text below.
Return ONLY a valid JSON array. No markdown, no code fences, no extra text.
Each object: { "id": "q1", "question": "...", "topic": "...", "options": {"A":"...","B":"...","C":"...","D":"..."}, "correctAnswer": "A"|"B"|"C"|"D", "explanation": "1-2 sentences", "difficulty": "${difficulty}" }

Text: ${text}`;
  }
  if (type === "truefalse") {
    return `Generate ${count} true/false questions at ${difficulty} difficulty.
Return ONLY JSON array: { "id", "question", "topic", "correctAnswer": "True"|"False", "explanation", "difficulty": "${difficulty}" }

Text: ${text}`;
  }
  return `Generate ${count} fill-in-the-blank questions at ${difficulty} difficulty. Use ___ for the blank.
Return ONLY JSON array: { "id", "question", "topic", "correctAnswer": "string", "explanation", "difficulty": "${difficulty}" }

Text: ${text}`;
}

function parseGroqResponse(raw: string): Question[] {
  const cleaned = raw
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function generateQuestionsForPdf(
  params: GenerateParams
): Promise<Question[]> {
  const { truncatedText, difficulty, questionCount, questionTypes } = params;

  const perType = Math.ceil(questionCount / questionTypes.length);
  const allQuestions: Question[] = [];

  for (const type of questionTypes) {
    const prompt = buildPrompt(type, perType, difficulty, truncatedText);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    try {
      const questions = parseGroqResponse(content);
      const typed = questions.map((q, i) => ({
        ...q,
        id: q.id || `${type}-${i + 1}`,
        type,
      }));
      allQuestions.push(...typed);
    } catch {
      console.error("Failed to parse Groq response for type:", type);
    }
  }

  return allQuestions;
}
