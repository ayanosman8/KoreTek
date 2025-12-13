module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/ai/openrouter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenRouter AI Client
 * Supports multiple models: Claude, GPT-4, Gemini, etc.
 */ __turbopack_context__.s([
    "MODELS",
    ()=>MODELS,
    "callOpenRouter",
    ()=>callOpenRouter
]);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
async function callOpenRouter(messages, options = {}) {
    const { model = "anthropic/claude-3.5-sonnet", temperature = 0.7, max_tokens = 4096 } = options;
    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": ("TURBOPACK compile-time value", "http://localhost:3001") || "http://localhost:3001",
            "X-Title": "KoreTek Project Estimator"
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens
        })
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}
const MODELS = {
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
    LLAMA_2_70B: "meta-llama/llama-2-70b-chat"
};
}),
"[project]/app/api/enhance-blueprint/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/openrouter.ts [app-route] (ecmascript)");
;
;
const enhancementPrompts = {
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
        system: `You are a business advisor specializing in SaaS monetization. Skip generic explanations - users already know what freemium, subscription, etc. mean. Jump straight to specific, actionable recommendations for THIS project. Be direct and concise.`,
        user: `Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Create a monetization strategy for THIS specific app. Skip generic model explanations. Be direct and actionable.

Format your response like this:

## Recommended Revenue Model
State the best model for this app (1-2 sentences explaining why this model fits)

## Pricing Strategy
**Monthly:** $X.XX (explain reasoning)
**Annual:** $XX.XX (explain discount strategy)
**Or:** One-time purchase of $XX if that makes more sense

## Feature Split

**Free Version:**
- Feature 1 (why this should be free)
- Feature 2 (why this hooks users)
- Feature 3 (creates habit/value)

**Premium Version ($X/month):**
- Feature 1 (why users will pay for this)
- Feature 2 (high-value add-on)
- Feature 3 (differentiation)

## Revenue Potential
- Target: X paid users in month 1-3
- Projected MRR: $X,XXX
- Key growth lever: [specific strategy]

## Quick Wins
1. Specific tactic to get first 10 paying users
2. Simple upsell strategy
3. Retention hook

Skip theory. Be specific to THIS app. Use numbers. Use "you/your".`
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
async function POST(request) {
    try {
        const { projectDescription, estimate, enhancementType } = await request.json();
        if (!projectDescription || !estimate || !enhancementType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const promptTemplate = enhancementPrompts[enhancementType];
        if (!promptTemplate) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid enhancement type"
            }, {
                status: 400
            });
        }
        // Format the prompt with actual data
        const formatPrompt = (template)=>{
            return template.replace("{description}", projectDescription).replace("{summary}", estimate.summary || "").replace("{features}", Array.isArray(estimate.features) ? estimate.features.join(", ") : "").replace("{techStack}", estimate.techStack ? JSON.stringify(estimate.techStack) : "");
        };
        const systemPrompt = formatPrompt(promptTemplate.system);
        const userPrompt = formatPrompt(promptTemplate.user);
        // Use cheaper model for enhancements - GPT-3.5 Turbo is fast and cost-effective
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callOpenRouter"])([
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userPrompt
            }
        ], {
            model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MODELS"].GPT_35_TURBO,
            temperature: 0.8,
            max_tokens: 1000
        });
        let processedResponse = response.trim();
        // For cool-features (JSON), strip markdown code blocks
        if (enhancementType === 'cool-features') {
            processedResponse = processedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            console.log("Cleaned cool-features response:", processedResponse);
        } else {
            processedResponse = processedResponse.replace(/```markdown\s*/g, '').replace(/```\s*/g, '');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            enhancement: processedResponse
        });
    } catch (error) {
        console.error("Error generating enhancement:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate enhancement. Please try again."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__600271f7._.js.map