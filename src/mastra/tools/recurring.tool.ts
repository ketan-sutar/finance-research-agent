import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { detectRecurringSubscriptions } from "../../tools/recurring";

export const recurringTool = createTool({
  id: "detect_recurring",

  description: `Detects recurring subscriptions like Netflix, Spotify from transaction history.`,
  inputSchema: z.object({}),

  async execute() {
    return await detectRecurringSubscriptions();
  },
});
