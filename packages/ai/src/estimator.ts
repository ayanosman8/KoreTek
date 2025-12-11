import { callOpenRouter, MODELS } from "./openrouter";
import type { ProjectEstimate } from "./types";

/**
 * Generate a project estimate from a user's description
 */
export async function generateProjectEstimate(
  projectDescription: string
): Promise<ProjectEstimate> {
  const systemPrompt = `You are an expert software development consultant specializing in modern, cutting-edge technology stacks.

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
  "features": ["feature 1", "feature 2", "feature 3", ...],
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

IMPORTANT FOR QUESTIONS:
- For simple yes/no questions, use strings: "Do you need offline support?"
- For questions with specific choices, use objects with options:
  { "text": "Preferred approach?", "options": ["Social features", "Personal only", "Hybrid"] }
- Always provide 2-4 specific options when the answer isn't a simple yes/no
- Options should be clear, specific, and mutually exclusive

Focus on providing detailed features, modern tech stack recommendations, identifying potential risks, and asking clarifying questions.
DO NOT include pricing or timeline estimates - those will be discussed during a follow-up consultation.`;

  const userPrompt = `Project Description: "${projectDescription}"

Please analyze this project and provide a comprehensive estimate in JSON format.`;

  try {
    const response = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: MODELS.CLAUDE_35_SONNET,
        temperature: 0.7,
        max_tokens: 1200,
      }
    );

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    const estimate: ProjectEstimate = JSON.parse(jsonMatch[0]);
    return estimate;
  } catch (error) {
    console.error("Error generating estimate:", error);
    throw new Error("Failed to generate project estimate");
  }
}
