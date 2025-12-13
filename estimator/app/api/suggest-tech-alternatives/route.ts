import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Pro status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile query error:', profileError);
      return NextResponse.json(
        { error: "Failed to check subscription status", details: profileError.message },
        { status: 500 }
      );
    }

    const status = profile?.subscription_status || (profile?.has_paid ? 'active' : null);
    const isPro = status === 'active';

    if (!isPro) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const { technology, category } = await request.json();

    if (!technology || !category) {
      return NextResponse.json(
        { error: "Technology and category are required" },
        { status: 400 }
      );
    }

    // Use GPT-3.5-turbo for cheap tech suggestions
    const response = await callOpenRouter(
      [
        {
          role: "user",
          content: `You are a tech stack advisor. Given a technology "${technology}" in the category "${category}", suggest 5-8 good alternative technologies that could serve the same purpose.

Rules:
- Only suggest widely-used, production-ready alternatives
- Include both popular and emerging options
- Consider similar complexity and use cases
- Return ONLY a JSON array of strings, nothing else
- Each alternative should be just the technology name (e.g., "Material UI", "Chakra UI")

Example format: ["Alternative 1", "Alternative 2", "Alternative 3"]

Technology: ${technology}
Category: ${category}

Suggest alternatives:`,
        },
      ],
      {
        model: MODELS.GPT_35_TURBO, // Very cheap model
        temperature: 0.7,
        max_tokens: 512,
      }
    );

    // Parse the JSON response
    const alternatives = JSON.parse(response.trim());

    return NextResponse.json({ alternatives });
  } catch (error) {
    console.error("Error suggesting alternatives:", error);
    return NextResponse.json(
      { error: "Failed to suggest alternatives" },
      { status: 500 }
    );
  }
}
