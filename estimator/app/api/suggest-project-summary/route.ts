import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, projectName, features } = await request.json();

    if (!projectDescription) {
      return NextResponse.json(
        { error: "Missing project description" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a product strategist writing executive summaries.

Create a concise, compelling 2-3 sentence summary that:
- Explains what the app does
- Highlights the core value proposition
- Mentions the target audience or use case
- Sounds professional and engaging

Return ONLY the summary, nothing else. No labels, no formatting, just the 2-3 sentences.`;

    const userPrompt = `Project Name: ${projectName || 'Not set'}
Project Description: ${projectDescription}
Key Features: ${features ? features.slice(0, 5).join(', ') : ''}

Generate a compelling 2-3 sentence executive summary:`;

    const response = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: MODELS.GPT_35_TURBO, // Fast and cheap
        temperature: 0.7,
        max_tokens: 150,
      }
    );

    const suggestedSummary = response.trim();

    return NextResponse.json({ summary: suggestedSummary });
  } catch (error) {
    console.error("Error suggesting project summary:", error);
    return NextResponse.json(
      { error: "Failed to suggest project summary. Please try again." },
      { status: 500 }
    );
  }
}
