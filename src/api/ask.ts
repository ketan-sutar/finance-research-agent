// import express from "express";
// import crypto from "crypto";

// import { logAgent } from "../utils/logger";
import { taraAgent } from "../mastra/agents/tara.agent";

export async function askTara(question: string) {
  const result = await taraAgent.generate(question);

  return result.text;
}

// const router = express.Router();

// router.post("/ask", async (req, res) => {
//   const start = Date.now();

//   const requestId = crypto.randomUUID();

//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({
//       error: "Question is required",
//     });
//   }

//   try {
//     const result = await taraAgent.generate(question);

//     logAgent({
//       request_id: requestId,
//       question,
//       latency_ms: Date.now() - start,
//       status: "success",
//     });

//     return res.json({
//       answer: result.text,
//     });
//   } catch (err: any) {
//     console.error("ASK_ERROR:", err);

//     logAgent({
//       request_id: requestId,
//       question,
//       latency_ms: Date.now() - start,
//       status: "failure",
//       error: err.message,
//     });

//     return res.status(500).json({
//       error: "internal error",
//     });
//   }
// });

// export default router;
