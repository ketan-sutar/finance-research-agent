import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "agent.log");

type LogPayload = {
  request_id: string;
  question: string;
  latency_ms: number;
  status: "success" | "failure";
  error?: string;
};

export function logAgent(payload: LogPayload) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    ...payload,
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n");

  console.log(`[${payload.status.toUpperCase()}]`, JSON.stringify(logEntry));
}
