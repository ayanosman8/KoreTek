import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, MODELS } from "@repo/ai/openrouter";
import type { ProjectEstimate } from "@repo/ai/types";

interface QuestionAnswer {
  question: string;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, originalEstimate, answeredQuestions } = await request.json();

    if (!projectDescription || !originalEstimate || !answeredQuestions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build the refinement prompt
    const answeredQuestionsText = answeredQuestions
      .filter((qa: QuestionAnswer) => qa.answer && qa.answer !== "Not answered")
      .map((qa: QuestionAnswer) => `- ${qa.question}: ${qa.answer}`)
      .join("\n");

    const systemPrompt = `You are an expert software development consultant. You previously provided an estimate for a project and asked clarifying questions. The client has now answered those questions.

Your task is to refine the original estimate based on their answers. Focus on:
1. KEEP THE ORIGINAL PROJECT NAME - Do not change "${originalEstimate.projectName}"
2. Adding or removing features based on their answers
3. Adjusting the tech stack if needed
4. Updating risks and next steps
5. Asking new, more specific questions (with options when appropriate)

IMPORTANT: For the questions array, use the same format as before:
- Simple yes/no questions as strings: "Do you need offline support?"
- Questions with specific options as objects: { "text": "Preferred platform?", "options": ["Mobile", "Web", "Both"] }
- Keep options SHORT and SIMPLE (e.g., "Mobile", "Web", "Both" not "Mobile first", "Web only")

Return a refined estimate in the same JSON format as before.`;

    const userPrompt = `Original Project: "${projectDescription}"

Original Estimate Summary: ${originalEstimate.summary}

Client's Answers to Questions:
${answeredQuestionsText || "No questions answered yet"}

Please provide a refined estimate in JSON format with this structure:
{
  "projectName": "${originalEstimate.projectName}",
  "summary": "Updated 2-3 sentence summary reflecting their answers",
  "features": ["updated feature list based on their requirements"],
  "techStack": {
    "frontend": ["..."],
    "backend": ["..."],
    "database": ["..."],
    "infrastructure": ["..."]
  },
  "risks": ["updated risks"],
  "nextSteps": ["updated next steps"],
  "questions": [
    "Simple yes/no question?",
    { "text": "Question with options?", "options": ["Option 1", "Option 2", "Option 3"] }
  ]
}`;

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
    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("Error refining estimate:", error);
    return NextResponse.json(
      { error: "Failed to refine estimate. Please try again." },
      { status: 500 }
    );
  }
}
