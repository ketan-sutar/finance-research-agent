import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { fundReturn, rankFundsByReturn } from "../../tools/funds";

export const fundReturnTool = createTool({
  id: "fund-return",

  description: `Calculates mutual fund return using NAV values between two dates. USE ONLY for fund performance questions.`,

  inputSchema: z.object({
    fundName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),

  outputSchema: z.any(),

  async execute({ input }) {
    return await fundReturn(input);
  },
});

export const rankFundsTool = createTool({
  id: "rank_funds",
  description: `
Ranks all funds by return.

USE FOR:
- best performing fund
- worst performing fund
- rank funds
- which fund performed best
- fund performance
- best mutual fund
`,
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  async execute({ input }) {
    return await rankFundsByReturn(input.startDate, input.endDate);
  },
});
