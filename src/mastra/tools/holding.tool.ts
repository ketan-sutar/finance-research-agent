// holding.tool.ts

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { holdingReturn, rankAllHoldings } from "../../tools/holdingReturn";

export const holdingReturnTool = createTool({
  id: "holding_return",

  description: "Calculates realized return on a specific holding",

  inputSchema: z.object({
    fundName: z.string(),
  }),

  async execute({ input }) {
    return await holdingReturn(input.fundName);
  },
});

export const rankHoldingsTool = createTool({
  id: "rank_holdings",
  description: `Ranks all holdings by realised return. USE FOR: "realised return on all holdings", "best performing holding", "portfolio return breakdown".`,
  inputSchema: z.object({}),
  async execute() {
    return await rankAllHoldings();
  },
});
