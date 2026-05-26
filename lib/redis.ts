import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;

export const CACHE_KEYS = {
  quiz: (quizId: string) => `quiz:${quizId}`,
  progress: (userId: string) => `progress:${userId}`,
  weakQuestions: (userId: string) => `weakquestions:${userId}`,
  leaderboard: (slug: string) => `leaderboard:${slug}`,
  guestUpload: (ip: string) => `ratelimit:upload:guest:${ip}`,
};

export const CACHE_TTL = {
  quiz: 3600,
  progress: 300,
  weakQuestions: 300,
  leaderboard: 600,
};
