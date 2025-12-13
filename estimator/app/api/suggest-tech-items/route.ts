import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { fieldType, featureName, featureDescription, projectDescription } = await request.json();

    if (!fieldType) {
      return NextResponse.json(
        { error: "Missing field type" },
        { status: 400 }
      );
    }

    // Build context for suggestions
    const context: string[] = [];
    if (featureName) context.push(`Feature: ${featureName}`);
    if (featureDescription) context.push(`Description: ${featureDescription}`);
    if (projectDescription) context.push(`Project: ${projectDescription}`);

    const contextString = context.join('\n');

    // Field-specific prompts
    const fieldPrompts: Record<string, string> = {
      payment_apis: `Suggest 3-5 popular payment API providers that would work well for this feature.
Common options include: Stripe, PayPal, Square, Braintree, Paddle, Razorpay, etc.
Return ONLY a JSON array of strings, like: ["Stripe", "PayPal", "Square"]`,

      ai_apis: `Suggest 3-5 popular AI API providers that would work well for this feature.
Common options include: OpenAI, Anthropic, Google AI, Cohere, Hugging Face, Replicate, ElevenLabs, etc.
Return ONLY a JSON array of strings, like: ["OpenAI", "Anthropic", "Google AI"]`,

      packages: `Suggest 3-5 popular NPM packages that would be useful for implementing this feature.
Think about what packages developers commonly use for similar features.
Return ONLY a JSON array of strings, like: ["react-query", "axios", "zustand"]`,

      services: `Suggest 3-5 popular cloud services/platforms that would be useful for this feature.
Common options include: Vercel, Supabase, AWS, Firebase, Cloudflare, Railway, etc.
Return ONLY a JSON array of strings, like: ["Vercel", "Supabase", "AWS S3"]`,

      tables: `Suggest 2-4 database table names that would be needed for this feature.
Use lowercase, snake_case naming convention. Be specific to the feature.
Return ONLY a JSON array of strings, like: ["users", "posts", "comments"]`,

      fields: `Suggest 3-6 important database field names for this feature.
Use lowercase, snake_case naming convention and include the table prefix (e.g., users.email).
Return ONLY a JSON array of strings, like: ["users.email", "users.name", "users.created_at"]`,
    };

    const systemPrompt = `You are a helpful assistant that suggests popular, production-ready tech stack choices for software features.
Your suggestions should be:
- Industry-standard and widely-used
- Appropriate for the feature being built
- Practical and realistic

${fieldPrompts[fieldType] || 'Suggest relevant items for this field.'}`;

    const userPrompt = contextString || 'General web application feature';

    const response = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: MODELS.GPT_35_TURBO, // Fast and cheap for simple suggestions
        temperature: 0.7,
        max_tokens: 150,
      }
    );

    // Parse the JSON array from the response
    let suggestions: string[] = [];
    try {
      // Try to parse the response as JSON
      const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleaned);
    } catch (parseError) {
      // If parsing fails, try to extract array-like content
      const match = response.match(/\[(.*?)\]/s);
      if (match) {
        try {
          suggestions = JSON.parse(`[${match[1]}]`);
        } catch {
          // If still fails, split by comma and clean up
          suggestions = match[1]
            .split(',')
            .map((s: string) => s.trim().replace(/['"]/g, ''))
            .filter(Boolean);
        }
      }
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 6) }); // Max 6 suggestions
  } catch (error) {
    console.error("Error suggesting tech items:", error);
    return NextResponse.json(
      { error: "Failed to suggest items. Please try again." },
      { status: 500 }
    );
  }
}
