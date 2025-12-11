/**
 * OpenRouter AI Client
 * Supports multiple models: Claude, GPT-4, Gemini, etc.
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Call OpenRouter API with any model
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
) {
  const {
    model = "anthropic/claude-3.5-sonnet", // Default to Claude 3.5 Sonnet
    temperature = 0.7,
    max_tokens = 4096,
  } = options;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
      "X-Title": "KoreTek Project Estimator",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Available models on OpenRouter
 */
export const MODELS = {
  // Claude models (Anthropic)
  CLAUDE_35_SONNET: "anthropic/claude-3.5-sonnet",
  CLAUDE_3_OPUS: "anthropic/claude-3-opus",
  CLAUDE_3_HAIKU: "anthropic/claude-3-haiku",

  // GPT models (OpenAI)
  GPT_4_TURBO: "openai/gpt-4-turbo",
  GPT_4: "openai/gpt-4",
  GPT_35_TURBO: "openai/gpt-3.5-turbo",

  // Google models
  GEMINI_PRO: "google/gemini-pro",

  // Meta models
  LLAMA_2_70B: "meta-llama/llama-2-70b-chat",
} as const;
