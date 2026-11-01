export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface SendMessageOptions {
  history: ChatHistoryItem[];
  prompt: string;
  mode: string;
  signal?: AbortSignal;
}

const DEFAULT_MODEL = "gemini-3.5-flash-lite";

/**
 * Collects all configured API keys in priority order.
 *
 * Supported env vars (checked in order):
 *   NEXT_PUBLIC_GEMINI_API_KEY_1, _2, _3 … _10   (numbered slots)
 *   NEXT_PUBLIC_GEMINI_API_KEY                     (legacy single key, always last)
 *
 * Paste each backup key into a new numbered variable in .env.local:
 *   NEXT_PUBLIC_GEMINI_API_KEY_1=AIza...
 *   NEXT_PUBLIC_GEMINI_API_KEY_2=AIza...
 */
export function getGeminiApiKeys(): string[] {
  const keys: string[] = [];

  // Numbered slots 1–10
  for (let i = 1; i <= 10; i++) {
    const k = (process.env[`NEXT_PUBLIC_GEMINI_API_KEY_${i}`] ?? "").trim();
    if (k) keys.push(k);
  }

  // Legacy single key (added last so numbered keys have higher priority)
  const legacy = (process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "").trim();
  if (legacy && !keys.includes(legacy)) keys.push(legacy);

  return keys;
}

export function getGeminiConfig() {
  const keys = getGeminiApiKeys();
  const apiKey = keys[0] ?? "";
  const model = (process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "").trim() || DEFAULT_MODEL;
  return { apiKey, model };
}

export function getSystemInstructionForMode(mode: string): string {
  const universal = `You are ORVEXA, a helpful and knowledgeable AI assistant. You can answer any question the user asks — whether it is about science, history, coding, math, general knowledge, trivia, writing, or any other topic. Never refuse or redirect a user away from a question. Always give a helpful, accurate, and concise response. If a document or file content is shared, read it fully and respond to whatever is asked about it.`;

  switch (mode) {
    case "summary":
      return `${universal}

You are currently in Quick Summary Mode. When the user shares study material or topics, also:
- Generate short, clear, and direct summaries.
- Explain essential definitions, formulas, and foundational concepts simply.
- Highlight exam-relevant points, high-yield takeaways, and common test pitfalls.
- Keep answers structured with clean bullet points and clear headings.`;

    case "revision-plan":
      return `${universal}

You are currently in Revision Planner Mode. When the user wants a study plan, also:
- Create a personalized, realistic, and structured revision schedule.
- Prioritize weak topics, high-yield exam areas, and knowledge gaps first.
- If the student specifies an exam date, timeline, or available study hours per day, tailor the schedule to their constraints.
- Integrate active recall, practice question intervals, and spaced repetition checkpoints.
- Use a clean, actionable timetable format.`;

    case "gap-audit":
    default:
      return `${universal}

You are currently in Gap Audit Mode. When the user shares study notes or syllabus content, also:
- Thoroughly analyze the notes, syllabus, questions, or conceptual explanations provided.
- Identify missing definitions, unaddressed edge cases, weak conceptual links, and prerequisite gaps.
- Clearly highlight identified knowledge gaps and explain why they matter for exam comprehension.
- Provide targeted revision priorities and concrete action steps to close each diagnosed gap.
- If no notes or topics have been provided yet, ask the student to paste their notes, upload a text/markdown file, or specify the syllabus topics they wish to audit.`;
  }
}

export async function callGeminiApi({
  history,
  prompt,
  mode,
  signal,
}: SendMessageOptions): Promise<string> {
  const keys = getGeminiApiKeys();
  const model = (process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "").trim() || DEFAULT_MODEL;

  if (keys.length === 0) {
    throw new Error(
      "No Gemini API key configured. Add NEXT_PUBLIC_GEMINI_API_KEY_1 (and optionally _2, _3…) to .env.local and restart the server."
    );
  }

  const systemInstruction = getSystemInstructionForMode(mode);

  // Build alternating contents for Gemini API (user / model turns)
  const contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }> = [];

  for (const item of history) {
    if (!item.content || !item.content.trim()) continue;
    const mappedRole = item.role === "assistant" ? "model" : "user";

    // Combine consecutive turns of the same role to maintain strict alternation
    const lastItem = contents[contents.length - 1];
    if (lastItem && lastItem.role === mappedRole) {
      lastItem.parts[0].text += `\n\n${item.content}`;
    } else {
      contents.push({
        role: mappedRole,
        parts: [{ text: item.content }],
      });
    }
  }

  // Ensure conversation history starts with a user turn
  while (contents.length > 0 && contents[0].role !== "user") {
    contents.shift();
  }

  // Append current prompt as the latest user turn
  const lastContent = contents[contents.length - 1];
  if (lastContent && lastContent.role === "user") {
    lastContent.parts[0].text += `\n\n${prompt}`;
  } else {
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });
  }

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  // --- Key rotation: try each key in order, skip to next on 429/403 ---
  let lastError: Error | null = null;

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
        signal,
      });
    } catch (fetchErr) {
      // Network error or aborted — don't try other keys for abort
      throw fetchErr;
    }

    if (response.ok) {
      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (!text) {
        if (candidate?.finishReason === "SAFETY") {
          throw new Error(
            "The response was flagged by Gemini safety filters. Please adjust your query."
          );
        }
        throw new Error("Received an empty response from Gemini API.");
      }

      return text;
    }

    // Parse error from this key
    const errorJson = await response.json().catch(() => null);
    const apiMessage = errorJson?.error?.message;

    if (response.status === 429 || response.status === 403) {
      // Rate-limited or unauthorized — try the next key
      const label = i + 1 < keys.length ? `trying key ${i + 2}…` : "no more keys available.";
      lastError = new Error(
        response.status === 429
          ? `Key ${i + 1} rate-limited (429). ${label}`
          : `Key ${i + 1} unauthorized (403). ${label}`
      );
      continue; // rotate to next key
    }

    if (response.status === 400 && apiMessage) {
      throw new Error(`Gemini API Error (400): ${apiMessage}`);
    }

    throw new Error(
      apiMessage ||
        `Gemini API request failed with status ${response.status} (${response.statusText}).`
    );
  }

  // All keys exhausted
  throw new Error(
    lastError?.message.includes("429")
      ? `All ${keys.length} Gemini API key(s) have hit their rate limits. Please wait a moment and try again, or add more backup keys.`
      : `All ${keys.length} Gemini API key(s) failed. ${lastError?.message ?? ""}`
  );
}

