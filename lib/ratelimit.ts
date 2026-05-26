import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
  prefix: "ratelimit:upload",
});

export const groqRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "24 h"),
  prefix: "ratelimit:groq",
});

export async function checkGuestUploadLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:upload:guest:${ip}`;
  const exists = await redis.exists(key);
  return exists === 1;
}

export async function setGuestUploadUsed(ip: string): Promise<void> {
  const key = `ratelimit:upload:guest:${ip}`;
  await redis.set(key, "1");
}

export async function clearGuestUploadLimit(ip: string): Promise<void> {
  const key = `ratelimit:upload:guest:${ip}`;
  await redis.del(key);
}
