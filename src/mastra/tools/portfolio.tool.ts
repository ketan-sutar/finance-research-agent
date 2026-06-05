import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { portfolioAnalysis } from "../../tools/portfolio";

export const portfolioTool = createTool({
  id: "portfolio_analysis",
  description: `Calculates total portfolio value and returns using holdings and latest NAV.`,
  inputSchema: z.object({}),
  outputSchema: z.any(),
  async execute({ input }) {
    return await portfolioAnalysis();
  },
});
