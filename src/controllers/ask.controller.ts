import { Request, Response } from "express";
import crypto from "crypto";

import { askSchema } from "../validator/ask.validtor";
import { askTara } from "../api/ask";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { logAgent } from "../utils/logger";

export async function askQuestion(
  req: Request,
  res: Response
): Promise<any> {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  try {
    const parsed = askSchema.safeParse(req.body);

    if (!parsed.success) {
      console.error(
        `[VALIDATION_ERROR] ${requestId}`,
        parsed.error.flatten()
      );

      return res.status(400).json(
        errorResponse(
          "Validation failed",
          parsed.error.flatten()
        )
      );
    }

    const { question } = parsed.data;

    console.log(
      `[REQUEST] ${requestId} Question: ${question}`
    );

    const answer = await askTara(question);

    const latency = Date.now() - start;

    console.log(
      `[SUCCESS] ${requestId} (${latency}ms)`
    );

    logAgent({
      request_id: requestId,
      question,
      latency_ms: latency,
      status: "success",
    });

    return res.status(200).json(
      successResponse(
        {
          requestId,
          answer,
        },
        "Answer generated successfully"
      )
    );
  } catch (error: any) {
    const latency = Date.now() - start;

    console.error(
      `[ERROR] ${requestId}`,
      error.message
    );

    logAgent({
      request_id: requestId,
      question: req.body?.question || "",
      latency_ms: latency,
      status: "failure",
      error: error.message,
    });

    return res.status(500).json(
      errorResponse("Internal Server Error")
    );
  }
}