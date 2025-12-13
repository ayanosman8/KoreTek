import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

const enhancementPrompts: Record<string, { system: string; user: string }> = {
  "target-audience": {
    system: `You are a product strategist. Be VERY concise - use short bullets, max 8 words each.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Identify target users. Use this EXACT format:

## 👥 Primary Users
**[Persona 1 Name]** - [Job/role], age XX-XX
• [Key trait]
• [Key trait]
• [Pain point this solves]

**[Persona 2 Name]** - [Job/role], age XX-XX
• [Key trait]
• [Key trait]
• [Pain point this solves]

## 🎯 Why They'll Use This
• [Benefit] - [Why it matters]
• [Benefit] - [Why it matters]
• [Benefit] - [Why it matters]

Max 8 words per bullet. Ultra brief.`
  },

  "monetization": {
    system: `You are a business advisor. Be EXTREMELY concise - use bullet points, no long paragraphs. Get straight to numbers and specifics.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Create a concise monetization strategy. Use this EXACT format with short bullets:

## 💰 Recommended Model
[Model name] - [One sentence why]

## 💵 Pricing
• Monthly: $X - [Brief reason]
• Annual: $XX/year - [Brief reason]

## 🆓 Free Features
• [Feature] - [Why free]
• [Feature] - [Why free]
• [Feature] - [Why free]

## ⭐ Pro Features ($X/mo)
• [Feature] - [Why paid]
• [Feature] - [Why paid]
• [Feature] - [Why paid]

## 📈 Revenue Goals
• Month 1-3: X users → $X MRR
• Growth tactic: [One specific action]

Keep everything under 10 words per bullet. No paragraphs.`
  },

  "mvp-comparison": {
    system: `You are a startup advisor. Be ULTRA concise - short bullets only, no long text.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Compare MVP vs Full launch. Use this EXACT format:

## 🚀 Quick Launch (MVP)
**Timeline:** X months
**Include:**
• [Feature]
• [Feature]
• [Feature]

**Skip for now:**
• [Feature]
• [Feature]

**Best if:** [One sentence scenario]

## ✨ Full Launch
**Timeline:** X months
**Everything in MVP plus:**
• [Feature]
• [Feature]
• [Feature]

**Best if:** [One sentence scenario]

## 💡 Our Pick
[MVP or Full] - [One sentence why]

Max 6 words per bullet. Ultra brief.`
  },

  "cool-features": {
    system: `You are a creative product designer brainstorming exciting features. Be imaginative but realistic and professional. Return ONLY valid JSON.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Current Features: {features}

Brainstorm 4-6 creative features they might not have thought of. Return ONLY a JSON array with this exact structure:

[
  {
    "title": "Feature Name",
    "description": "1-2 sentence explanation of why this would be valuable",
    "category": "Enhancement" or "Innovation" or "User Experience" or "Analytics"
  }
]

Focus on:
- Features that add real value
- Unexpected but useful additions
- Things that would differentiate the product
- Practical future possibilities

Be creative but professional. No emojis. Return ONLY the JSON array, nothing else.`
  }
};

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, estimate, enhancementType } = await request.json();

    if (!projectDescription || !estimate || !enhancementType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const promptTemplate = enhancementPrompts[enhancementType];
    if (!promptTemplate) {
      return NextResponse.json(
        { error: "Invalid enhancement type" },
        { status: 400 }
      );
    }

    // Format the prompt with actual data
    const formatPrompt = (template: string) => {
      return template
        .replace("{description}", projectDescription)
        .replace("{summary}", estimate.summary || "")
        .replace("{features}", Array.isArray(estimate.features) ? estimate.features.join(", ") : "")
        .replace("{techStack}", estimate.techStack ? JSON.stringify(estimate.techStack) : "");
    };

    const systemPrompt = formatPrompt(promptTemplate.system);
    const userPrompt = formatPrompt(promptTemplate.user);

    // Use cheaper model for enhancements - GPT-3.5 Turbo is fast and cost-effective
    const response = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: MODELS.GPT_35_TURBO, // Much cheaper than Claude Sonnet (~10x less)
        temperature: 0.8,
        max_tokens: 1000, // Increased for better monetization details
      }
    );

    let processedResponse = response.trim();

    // For cool-features (JSON), strip markdown code blocks
    if (enhancementType === 'cool-features') {
      processedResponse = processedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      console.log("Cleaned cool-features response:", processedResponse);
    }
    // For other enhancement types, keep the markdown formatting but clean up code blocks if present
    else {
      processedResponse = processedResponse.replace(/```markdown\s*/g, '').replace(/```\s*/g, '');
    }

    return NextResponse.json({ enhancement: processedResponse });
  } catch (error) {
    console.error("Error generating enhancement:", error);
    return NextResponse.json(
      { error: "Failed to generate enhancement. Please try again." },
      { status: 500 }
    );
  }
}
