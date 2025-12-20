// src/learning/promptEngine.js
import { getTeachingPrompt } from "./promptTemplates";

export async function generateTeachingResponse({ mode, topic, content }) {
  const prompt = getTeachingPrompt({
    mode,
    topic,
    content,
  });

  // 🔁 Replace this with Gemini / OpenAI later
  // For now: MOCK RESPONSE (important for testing)
  return {
    promptUsed: mode,
    text: `(${mode.toUpperCase()} MODE)\n\n${prompt.slice(0, 300)}...`,
  };
}
