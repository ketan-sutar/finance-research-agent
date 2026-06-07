
import { taraAgent } from "../mastra/agents/tara.agent";

export async function askTara(question: string) {
  const result = await taraAgent.generate(question);

  return result.text;
}
