import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, currentName, features } = await request.json();

    if (!projectDescription) {
      return NextResponse.json(
        { error: "Missing project description" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a creative naming expert. Generate a catchy, memorable, brandable app name.

IMPORTANT NAMING GUIDELINES:
- Create a CREATIVE, BRANDABLE app name (like "TasteTrail", "Snapify", "Chatly")
- NOT descriptive names (avoid "Personal Restaurant Journal", "Chat Application")
- Think like a real app in the App Store - catchy, memorable, unique
- Maximum 2 words, easy to say and remember
- Should evoke the core value or feeling of the app

Return ONLY the app name, nothing else. No explanations, no quotes, just the name.`;

    const userPrompt = `Project Description: ${projectDescription}

Current Name: ${currentName || 'Not set'}
Key Features: ${features ? features.slice(0, 3).join(', ') : ''}

Generate ONE creative, brandable app name:`;

    const response = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: MODELS.GPT_35_TURBO, // Fast and cheap for simple name generation
        temperature: 0.9, // Higher creativity
        max_tokens: 20,
      }
    );

    const suggestedName = response.trim().replace(/['"]/g, ''); // Remove quotes if present

    return NextResponse.json({ name: suggestedName });
  } catch (error) {
    console.error("Error suggesting project name:", error);
    return NextResponse.json(
      { error: "Failed to suggest project name. Please try again." },
      { status: 500 }
    );
  }
}
