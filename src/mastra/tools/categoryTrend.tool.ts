import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { categoryTrend } from "../../tools/categoryTrend";

export const categoryTrendTool = createTool({
  id: "category_trend",
  description: `
Returns monthly spending trend.

USE FOR:
- compare food vs travel
- category comparison
- spending trend
- monthly trend
- category growth
- compare categories
`,
  inputSchema: z.object({
    categories: z.array(z.string()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  execute: async ({ input }) => {
    return await categoryTrend(
      input.categories,
      input.startDate,
      input.endDate,
    );
  },
});
