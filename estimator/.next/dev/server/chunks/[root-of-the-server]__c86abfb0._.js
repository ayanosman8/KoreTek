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
"[project]/app/api/suggest-project-name/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/openrouter.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { projectDescription, currentName, features } = await request.json();
        if (!projectDescription) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing project description"
            }, {
                status: 400
            });
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
            temperature: 0.9,
            max_tokens: 20
        });
        const suggestedName = response.trim().replace(/['"]/g, ''); // Remove quotes if present
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            name: suggestedName
        });
    } catch (error) {
        console.error("Error suggesting project name:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to suggest project name. Please try again."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c86abfb0._.js.map