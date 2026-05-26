export const dynamic = "force-dynamic";

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processPdf } from "@/inngest/functions/processPdf";
import { sendReviewReminder } from "@/inngest/functions/sendReviewReminder";
import { cleanupGuestData } from "@/inngest/functions/cleanupGuestData";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPdf, sendReviewReminder, cleanupGuestData],
});
