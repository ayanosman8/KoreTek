import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@/lib/ai/openrouter";

const enhancementPrompts: Record<string, { system: string; user: string }> = {
  "target-audience": {
    system: `You are a product strategist helping identify target users. Be practical and insightful. Use markdown formatting for clear structure.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Analyze the target audience for this project. Use structured markdown with headings and bullet points.

Format your response like this:

## Primary User Personas
Create 2-3 specific user personas with names and characteristics

## Demographics & Characteristics
- List key demographic details
- User behaviors and preferences
- Technical proficiency levels

## Pain Points & Solutions
Detail the main problems this app solves for each persona

## Why They'd Choose This
- Key differentiators from alternatives
- Unique value propositions
- Specific benefits for each persona

Be detailed and specific. Use "you" and "your" when addressing the user.`
  },

  "monetization": {
    system: `You are a business advisor specializing in SaaS and app monetization. Be strategic and practical. Use markdown formatting for clear structure.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Suggest monetization strategies for this app. Use structured markdown with clear headings and lists.

Format your response like this:

## Revenue Model Options

### 1. [Model Name]
**Description:** Brief explanation
**Pros:**
- List specific advantages for this app
**Cons:**
- List potential challenges
**Best for:** When to choose this model

### 2. [Model Name]
(same format)

### 3. [Model Name]
(same format)

## Recommended Pricing Strategy
Detail your recommended approach with specific price points if applicable

## Feature Gating Strategy
**Free Tier:**
- Features to keep free

**Premium Tier:**
- Features to gate behind payment

**Reasoning:** Explain the strategy

Be specific with actual price ranges and concrete examples. Use "you" and "your".`
  },

  "mvp-comparison": {
    system: `You are a startup advisor helping someone decide on launch strategy. Be practical and encouraging. Use markdown formatting for clear structure.`,
    user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Compare two launch approaches using structured markdown.

Format your response like this:

## Quick Launch (MVP) 🚀

**Timeline:** Estimated time to launch
**Core Features:**
- List 4-6 essential features only
**Features to Skip (For Now):**
- List nice-to-have features to defer

**Benefits of This Approach:**
1. Numbered list of advantages
2. Why this works for validation

**Best For:** When to choose this strategy

## Perfect Launch (Full Build) ✨

**Timeline:** Estimated time to launch
**Complete Feature Set:**
- List all features including polish and extras
**Additional Investments:**
- Design refinement
- Advanced features
- Additional integrations

**Benefits of This Approach:**
1. Numbered list of advantages
2. When the investment pays off

**Best For:** When to choose this strategy

## Our Recommendation
Give a clear recommendation based on the project type. Use "you" and "your".`
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
        max_tokens: 800,
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
