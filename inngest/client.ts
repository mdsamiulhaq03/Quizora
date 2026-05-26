import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "quizora",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
