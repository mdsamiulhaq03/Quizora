import { SRS_INTERVALS } from "./types";

export function getNextReviewDate(currentInterval: number): {
  nextReviewAt: Date;
  srsInterval: number;
} {
  const currentIndex = SRS_INTERVALS.indexOf(currentInterval);
  const nextIndex = Math.min(currentIndex + 1, SRS_INTERVALS.length - 1);
  const nextInterval = SRS_INTERVALS[nextIndex];

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + nextInterval);
  nextReviewAt.setHours(0, 0, 0, 0);

  return { nextReviewAt, srsInterval: nextInterval };
}

export function resetSRS(): { nextReviewAt: Date; srsInterval: number } {
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + SRS_INTERVALS[0]);
  nextReviewAt.setHours(0, 0, 0, 0);
  return { nextReviewAt, srsInterval: SRS_INTERVALS[0] };
}
