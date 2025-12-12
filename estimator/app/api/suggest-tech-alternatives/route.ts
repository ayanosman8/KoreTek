import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/auth/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Pro status
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid')
      .eq('id', user.id)
      .single();

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

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
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
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    const alternatives = JSON.parse(content.text.trim());

    return NextResponse.json({ alternatives });
  } catch (error) {
    console.error("Error suggesting alternatives:", error);
    return NextResponse.json(
      { error: "Failed to suggest alternatives" },
      { status: 500 }
    );
  }
}
