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
"[project]/lib/ai/estimator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateProjectEstimate",
    ()=>generateProjectEstimate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/openrouter.ts [app-route] (ecmascript)");
;
async function generateProjectEstimate(projectDescription) {
    const systemPrompt = `You are an expert software development consultant specializing in modern, cutting-edge technology stacks.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanatory text. Just the raw JSON object.

IMPORTANT NAMING GUIDELINES:
- Create a CREATIVE, BRANDABLE app name (like "TasteTrail", "Snapify", "Chatly")
- NOT descriptive names (avoid "Personal Restaurant Journal", "Chat Application")
- Think like a real app in the App Store - catchy, memorable, unique
- Maximum 2 words, easy to say and remember

IMPORTANT: Always recommend the MOST MODERN and CUTTING-EDGE technologies available in 2025:

Tech Stack Preferences:
- Frontend: Next.js 15+, React 19, TypeScript, Tailwind CSS v4
- Backend: Next.js API Routes, tRPC, or Hono (avoid Express)
- Database: Supabase (PostgreSQL), Prisma ORM, Drizzle ORM (avoid MongoDB)
- Auth: Clerk, Auth.js (NextAuth), Supabase Auth (avoid Auth0)
- Email: Resend, React Email (avoid SendGrid, Mailgun)
- Payments: Stripe with modern checkout
- Storage: Vercel Blob, Supabase Storage, Cloudflare R2
- Real-time: Supabase Realtime, Pusher, Socket.io
- Infrastructure: Vercel, Railway, Fly.io (modern platforms)
- Mobile: React Native with Expo, or native Swift/Kotlin

Your response must be a valid JSON object with this exact structure:
{
  "projectName": "Suggested project name",
  "summary": "2-3 sentence executive summary",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "techStack": {
    "frontend": ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
    "backend": ["Next.js API Routes", "tRPC"],
    "database": ["Supabase (PostgreSQL)", "Prisma ORM"],
    "infrastructure": ["Vercel", "Supabase"]
  },
  "risks": ["risk 1", "risk 2", ...],
  "nextSteps": ["step 1", "step 2", ...],
  "questions": [
    "Simple yes/no question?",
    { "text": "Question with specific options?", "options": ["Option 1", "Option 2", "Option 3"] }
  ]
}

IMPORTANT: Keep features list SHORT - only 4-6 CORE features that are absolutely essential for the MVP.
Focus on what's needed to make the app functional, not every possible feature.
Think "minimum viable product" - users can explore additional features later through enhancements.

IMPORTANT FOR QUESTIONS:
- For simple yes/no questions, use strings: "Do you need offline support?"
- For questions with specific choices, use objects with options:
  { "text": "Preferred platform?", "options": ["Mobile", "Web", "Both"] }
- Always provide 2-4 specific options when the answer isn't a simple yes/no
- Keep options SHORT and SIMPLE (e.g., "Mobile", "Web", "Both" not "Mobile first", "Web only", "Both equally important")
- Options should be clear, specific, and mutually exclusive

Focus on providing detailed features, modern tech stack recommendations, identifying potential risks, and asking clarifying questions.
DO NOT include pricing or timeline estimates - those will be discussed during a follow-up consultation.`;
    const userPrompt = `Project Description: "${projectDescription}"

Please analyze this project and provide a comprehensive estimate in JSON format.`;
    try {
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
            model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MODELS"].CLAUDE_35_SONNET,
            temperature: 0.7,
            max_tokens: 1200
        });
        // Remove markdown code blocks if present
        let cleanedResponse = response.trim();
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        // Parse JSON from response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Failed to extract JSON. Raw response:", response);
            console.error("Cleaned response:", cleanedResponse);
            throw new Error("Failed to extract JSON from AI response");
        }
        const estimate = JSON.parse(jsonMatch[0]);
        return estimate;
    } catch (error) {
        console.error("Error generating estimate:", error);
        throw new Error("Failed to generate project estimate");
    }
}
}),
"[project]/app/api/generate-estimate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$estimator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/estimator.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { projectDescription } = await request.json();
        if (!projectDescription || typeof projectDescription !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Project description is required"
            }, {
                status: 400
            });
        }
        if (projectDescription.length < 20) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Please provide a more detailed project description (at least 20 characters)"
            }, {
                status: 400
            });
        }
        // Generate estimate using OpenRouter + Claude
        const estimate = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$estimator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateProjectEstimate"])(projectDescription);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            estimate
        });
    } catch (error) {
        console.error("Error generating estimate:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate estimate. Please try again."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__157033d4._.js.map