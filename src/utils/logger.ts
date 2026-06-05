import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs", "agent.log");

export function logAgent(data: any) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(data) + "\n");
}
