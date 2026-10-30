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

export function getGeminiConfig() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() || "";
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return { apiKey, model };
}

export function getSystemInstructionForMode(mode: string): string {
  switch (mode) {
    case "summary":
      return `You are ORVEXA in Quick Summary Mode.
Your objectives:
- Generate short, clear, and direct summaries of the study material or topics provided.
- Explain essential definitions, formulas, and foundational concepts simply without unnecessary jargon.
- Highlight exam-relevant points, high-yield takeaways, and common test pitfalls.
- Keep answers structured with clean bullet points and clear headings.`;

    case "revision-plan":
      return `You are ORVEXA in Revision Planner Mode.
Your objectives:
- Create a personalized, realistic, and structured revision schedule (e.g., daily breakdown or milestone roadmap).
- Prioritize weak topics, high-yield exam areas, and knowledge gaps first.
- If the student specifies an exam date, timeline, or available study hours per day, tailor the schedule specifically to their constraints.
- Integrate active recall, practice question intervals, and spaced repetition checkpoints.
- Use a clean, actionable timetable format.`;

    case "gap-audit":
    default:
      return `You are ORVEXA in Gap Audit Mode.
Your objectives:
- Thoroughly analyze the student's study notes, syllabus, questions, or conceptual explanations.
- Identify missing definitions, unaddressed edge cases, weak conceptual links, and prerequisite gaps.
- Clearly highlight identified knowledge gaps and explain why they matter for exam comprehension.
- Provide targeted revision priorities and concrete action steps to close each diagnosed gap.
- If no notes or topics have been provided yet, politely ask the student to paste their notes, upload a text/markdown file, or specify the syllabus topics they wish to audit. Do not claim to analyze any file unless actual file text is provided.`;
  }
}

export async function callGeminiApi({
  history,
  prompt,
  mode,
  signal,
}: SendMessageOptions): Promise<string> {
  const { apiKey, model } = getGeminiConfig();

  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please add your Google AI Studio API key to NEXT_PUBLIC_GEMINI_API_KEY in .env.local and restart the development server."
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

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
    signal,
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const apiMessage = errorJson?.error?.message;

    if (response.status === 400 && apiMessage) {
      throw new Error(`Gemini API Error (400): ${apiMessage}`);
    } else if (response.status === 403) {
      throw new Error(
        "Invalid or unauthorized Gemini API key. Please verify your Google AI Studio API key in .env.local and restart the server."
      );
    } else if (response.status === 429) {
      throw new Error(
        "Gemini API rate limit exceeded. Please wait a moment before trying again."
      );
    } else {
      throw new Error(
        apiMessage ||
          `Gemini API request failed with status ${response.status} (${response.statusText}).`
      );
    }
  }

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

