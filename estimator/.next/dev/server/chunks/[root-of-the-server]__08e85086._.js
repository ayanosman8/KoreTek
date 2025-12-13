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
async function generateProjectEstimate(projectDescription, userPreferences) {
    // Build user preferences section if provided
    let userPreferencesSection = '';
    if (userPreferences && Object.values(userPreferences).some((arr)=>arr && arr.length > 0)) {
        userPreferencesSection = `\n\nUSER'S PREFERRED TECH STACK:
IMPORTANT: The user has specified their preferred technologies. Use these as defaults whenever appropriate:
${userPreferences.frontend && userPreferences.frontend.length > 0 ? `- Frontend: ${userPreferences.frontend.join(', ')}` : ''}
${userPreferences.backend && userPreferences.backend.length > 0 ? `- Backend: ${userPreferences.backend.join(', ')}` : ''}
${userPreferences.database && userPreferences.database.length > 0 ? `- Database: ${userPreferences.database.join(', ')}` : ''}
${userPreferences.auth && userPreferences.auth.length > 0 ? `- Auth: ${userPreferences.auth.join(', ')}` : ''}
${userPreferences.infrastructure && userPreferences.infrastructure.length > 0 ? `- Infrastructure: ${userPreferences.infrastructure.join(', ')}` : ''}
${userPreferences.payment_apis && userPreferences.payment_apis.length > 0 ? `- Payment APIs: ${userPreferences.payment_apis.join(', ')}` : ''}
${userPreferences.ai_apis && userPreferences.ai_apis.length > 0 ? `- AI APIs: ${userPreferences.ai_apis.join(', ')}` : ''}
${userPreferences.services && userPreferences.services.length > 0 ? `- Services: ${userPreferences.services.join(', ')}` : ''}

Use these preferred technologies in your recommendations unless the project specifically requires different tools.\n`;
    }
    const systemPrompt = `You are an expert software development consultant who creates feature-focused, actionable blueprints for modern applications.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanatory text. Just the raw JSON object.${userPreferencesSection}

IMPORTANT NAMING GUIDELINES:
- Create a CREATIVE, BRANDABLE app name (like "TasteTrail", "Snapify", "Chatly")
- NOT descriptive names (avoid "Personal Restaurant Journal", "Chat Application")
- Think like a real app in the App Store - catchy, memorable, unique
- Maximum 2 words, easy to say and remember

SUMMARY GUIDELINES:
- Focus on WHAT USERS CAN DO, not technical implementation
- Highlight the core value proposition and main capabilities
- Keep it concise (2-3 sentences max)
- Example: "TasteTrail lets food lovers discover, save, and share restaurant experiences. Users can log meals with photos, get AI-powered recommendations, and connect with fellow foodies."
- NOT: "A full-stack application built with Next.js that provides restaurant tracking functionality using PostgreSQL database."

IMPORTANT: Always recommend the MOST MODERN and CUTTING-EDGE technologies available in 2025:

Tech Stack Preferences:
- Frontend: Next.js 15+, React 19, TypeScript, Tailwind CSS v4
- Backend API:
  * Simple APIs: Next.js API Routes
  * Type-safe APIs: tRPC (highly recommended for full-stack Next.js)
  * High-performance/Edge: Hono (ultra-fast, edge-ready)
  * AVOID: Express, Fastify (outdated for modern apps)
- Database: PostgreSQL, MySQL (actual database engines - NOT services like Supabase)
- ORM: Prisma, Drizzle ORM (database tools)
- Auth: Clerk, Supabase Auth, Auth.js/NextAuth
- Services: Resend (email), Stripe (payments), Uploadthing (storage)
- Infrastructure: Vercel, Railway, Fly.io (hosting platforms)
- Mobile: React Native with Expo, or native Swift/Kotlin

BACKEND SELECTION GUIDE:
- For simple CRUD with Next.js: Next.js API Routes
- For type-safe full-stack: tRPC (best choice for most apps)
- For edge/serverless performance: Hono
- Consider suggesting multiple: ["tRPC", "Hono"] for flexibility

IMPORTANT CATEGORIZATION:
- "frontend": UI frameworks only (React, Next.js, TypeScript, Tailwind)
- "backend": API frameworks only (Next.js API Routes, tRPC, Hono)
- "database": Actual database + ORM (PostgreSQL, Prisma ORM)
- "auth": Authentication services (Clerk, Supabase Auth, Auth.js)
- "services": Third-party services (Resend, Stripe, Uploadthing, etc.)
- "infrastructure": Hosting/deployment (Vercel, Railway, Supabase platform)

Your response must be a valid JSON object with this exact structure:
{
  "projectName": "Suggested project name",
  "summary": "2-3 sentence FEATURE-FOCUSED summary highlighting the core capabilities users will get",
  "features": [
    {
      "name": "Barcode Scanner Screen",
      "description": "Scanner screen with camera access and barcode detection. Product lookup modal shows item details when barcode is scanned.",
      "tier": "free",
      "tech": {
        "packages": ["react-camera-pro", "quagga2"],
        "services": ["UPC Database API"]
      },
      "resources": []
    },
    {
      "name": "Recipe Discovery Screen",
      "description": "Recipe discovery page with ingredient matching and recipe cards. Detail modal shows cooking instructions and ingredients list.",
      "tier": "pro",
      "tech": {
        "packages": ["openai", "axios"],
        "services": ["OpenAI API", "Spoonacular API"]
      },
      "resources": []
    }
  ],
  "techStack": {
    "frontend": ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
    "backend": ["tRPC", "Hono"],
    "database": ["PostgreSQL", "Prisma ORM"],
    "auth": ["Clerk"],
    "payment_apis": ["Stripe", "PayPal"],
    "ai_apis": ["OpenAI", "Anthropic"],
    "services": ["Resend", "Uploadthing"],
    "infrastructure": ["Vercel"]
  },
  "risks": ["Concise technical risk 1", "Concise technical risk 2"],
  "nextSteps": [
    "Create Next.js project with TypeScript and Tailwind CSS",
    "Set up Clerk for authentication (signup/login)",
    "Design database schema in Prisma (users, posts tables)",
    "Deploy to Vercel and configure environment variables",
    "Implement core feature components",
    "Set up Stripe for payment processing"
  ],
  "questions": [
    "Simple yes/no question?",
    { "text": "Question with specific options?", "options": ["Option 1", "Option 2", "Option 3"] }
  ]
}

NOTE: Backend should typically include tRPC for type safety. Add Hono for edge/performance needs.

IMPORTANT FEATURES STRUCTURE:
- Generate 5-10 USER-FACING features ordered by IMPORTANCE/VALUE
- Order features from most critical to nice-to-have:
  1. CORE features (essential for app to function - e.g., "Barcode Scanning", "Pantry Inventory View")
  2. ESSENTIAL features (important functionality - e.g., "Expiration Tracking", "Search & Filter")
  3. VALUABLE features (strong utility - e.g., "Shopping List Generation", "Low Stock Alerts")
  4. ENHANCEMENT features (nice-to-have - e.g., "Recipe Suggestions", "Meal Planning")
  5. PREMIUM features (advanced/AI - e.g., "Smart Recommendations", "Nutrition Analysis")

FEATURE NAMING:
- Use SPECIFIC screen/view names that describe the main UI element (3-5 words)
- Include "Screen", "Dashboard", "View", "Page" in the name to be specific
- Examples: "Barcode Scanner Screen", "Pantry Dashboard View", "Expiration Tracker Page", "Shopping List Generator", "Recipe Discovery Screen"
- Examples: "Drink Log Screen", "Monthly Stats Dashboard", "Health Insights Page"
- NOT: "Barcode Scanning", "Drink Logging", "User Authentication"

FEATURE DESCRIPTIONS:
- Provide brief, clear implementation summary (1-2 sentences)
- Focus on: what screens/pages are needed and key UI elements
- Keep it simple and readable - avoid overwhelming technical details
- Examples:
  ✅ GOOD: "Scanner screen with camera access and barcode detection. Product lookup modal shows item details when barcode is scanned."
  ✅ GOOD: "Inventory dashboard showing all items with search, filters, and quantity controls. Item detail view for editing."
  ✅ GOOD: "Quick-add screen with drink type selector, serving size options, and ABV calculator. Preset buttons for common drinks."

Each feature should follow this structure:
{
  "name": "Specific Screen/View Name (e.g., Barcode Scanner Screen, Recipe Discovery Screen, Drink Log Screen)",
  "description": "Brief 1-2 sentence summary of what screens/pages are needed and key UI elements. Keep it simple and readable.",
  "tier": "free" OR "pro",
  "tech": {
    "packages": ["Exact npm package names like '@clerk/nextjs', 'uploadthing', 'stripe'"],
    "services": ["Third-party services like 'Clerk', 'Supabase', 'Stripe', 'Vercel'"]
  },
  "resources": []
}

FEATURE TIER GUIDELINES:
- "free": Basic functionality, essential for core experience
- "pro": Advanced features, premium capabilities, heavy API usage

Focus on technical depth - developers need to know EXACTLY what packages/APIs to use.

IMPORTANT FOR NEXT STEPS:
Generate 5-8 PRACTICAL, ACTIONABLE next steps that a developer can immediately execute.
Each step should be a concrete task, not a vague suggestion. Examples:
- "Set up Supabase project and configure authentication"
- "Design database schema with users, posts, and comments tables"
- "Install and configure Clerk for user authentication"
- "Create Next.js project with TypeScript and Tailwind CSS"
- "Set up Stripe account and configure payment webhooks"
- "Deploy to Vercel and configure environment variables"
- "Implement responsive navigation component"
- "Set up tRPC router for type-safe API endpoints"

Focus on SETUP, INFRASTRUCTURE, and CORE IMPLEMENTATION tasks in a logical order.

IMPORTANT FOR QUESTIONS:
- For simple yes/no questions, use strings: "Do you need offline support?"
- For questions with specific choices, use objects with options:
  { "text": "Preferred platform?", "options": ["Mobile", "Web", "Both"] }
- Always provide 2-4 specific options when the answer isn't a simple yes/no
- Keep options SHORT and SIMPLE (e.g., "Mobile", "Web", "Both" not "Mobile first", "Web only", "Both equally important")
- Options should be clear, specific, and mutually exclusive

Focus on providing detailed features, modern tech stack recommendations, identifying potential risks, and practical next steps.`;
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
"[project]/lib/auth/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "getSession",
    ()=>getSession,
    "getUser",
    ()=>getUser,
    "getUserProfile",
    ()=>getUserProfile,
    "hasPaid",
    ()=>hasPaid,
    "isAdmin",
    ()=>isAdmin,
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://tgmwpmsujlgzsakwutqj.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbXdwbXN1amxnenNha3d1dHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTEyNjIsImV4cCI6MjA3OTAyNzI2Mn0.MVU5sPCs8HRBnafolPOdTczBPQ1yw2itMsEhvUUmI4k");
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
async function getSession() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    return data.session;
}
async function getUser() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
}
async function requireAuth() {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return profile;
}
async function isAdmin() {
    const profile = await getUserProfile();
    return profile?.role === 'admin';
}
async function hasPaid() {
    const profile = await getUserProfile();
    return profile?.has_paid === true;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/server.ts [app-route] (ecmascript)");
;
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
        // Try to get user's tech preferences if they're logged in
        let userPreferences = undefined;
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('tech_preferences').eq('id', user.id).single();
                if (profile?.tech_preferences) {
                    userPreferences = profile.tech_preferences;
                    console.log('Using user tech preferences:', userPreferences);
                }
            }
        } catch (error) {
            // If we can't get preferences, continue without them
            console.log('No user preferences found, using defaults');
        }
        // Generate estimate using OpenRouter + Claude with user preferences
        const estimate = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$estimator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateProjectEstimate"])(projectDescription, userPreferences);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__08e85086._.js.map