import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import {
  queryTransactions,
  aggregateSpend,
  topMerchants,
  totalSpend,
  biggestCategory,
  merchantSpend,
} from "../../tools/transactions";

console.log("=== transactions.tool.ts loaded (new version) goes herer ===");

export const queryTransactionsTool = createTool({
  id: "query_transactions",
  description: `
Fetch transactions from database.

USE FOR:
- show transactions
- rent transactions
- transactions in April
- transactions from merchant
- spending history
- transaction search
- Swiggy transactions
- Amazon transactions
- food transactions
- travel transactions

Returns raw transaction list.
`,
  inputSchema: z.object({
    category: z.string().optional(),
    merchant: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),

  async execute({ input }) {
    return await queryTransactions(input);
  },
});

export const aggregateSpendTool = createTool({
  id: "aggregate_spend",
  description: `Returns TOTAL spend amount for a category between two dates. USE THIS FOR SUMMARY QUESTIONS like "How much did I spend on food". Excludes transfers automatically.`,
  inputSchema: z.object({
    category: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),

  execute: async (params) => {
    const { category, startDate, endDate } =
      params.context ?? params.input ?? params;
    return await aggregateSpend(category, startDate, endDate);
  },
});

export const topMerchantsTool = createTool({
  id: "top_merchants",
  description: `Returns top merchants by spending amount in a date range. USE THIS ONLY for ranking questions like "top 5 merchants".`,
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
    limit: z.number().optional(),
  }),

  execute: async (params) => {
    const { startDate, endDate, limit } =
      params.context ?? params.input ?? params;
    return await topMerchants(startDate, endDate, limit ?? 5);
  },
});

export const totalSpendTool = createTool({
  id: "total_spend",
  description: `
Returns total spend across ALL categories.

USE FOR:
- total spend
- overall spend
- ignore transfers
- total spending
- how much did I spend in total
- Q1 spend
- Jan to Mar spend
- total expenses

Excludes transfers automatically.
`,
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  execute: async ({ input }) => {
    return await totalSpend(input.startDate, input.endDate);
  },
});

export const biggestCategoryTool = createTool({
  id: "biggest_category",
  description: `
Returns biggest spending category.

USE FOR:
- biggest expense category
- highest spending category
- largest category
- what did I spend most on
- spending category ranking
`,
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  execute: async ({ input }) => {
    return await biggestCategory(input.startDate, input.endDate);
  },
});

export const merchantSpendTool = createTool({
  id: "merchant_spend",

  description: `
  USE FOR:
  - How much did I spend on Swiggy?
  - Spend at Amazon
  - Money spent at merchant
  - Merchant spending
  `,

  inputSchema: z.object({
    merchant: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),

  execute: async ({ input }) =>
    merchantSpend(input.merchant, input.startDate, input.endDate),
});
