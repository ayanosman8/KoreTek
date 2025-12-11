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
      .filter((qa: QuestionAnswer) => qa.answer === "Yes")
      .map((qa: QuestionAnswer) => `- ${qa.question}: ${qa.answer}`)
      .join("\n");

    const systemPrompt = `You are an expert software development consultant. You previously provided an estimate for a project and asked clarifying questions. The client has now answered those questions.

Your task is to refine the original estimate based on their answers. Focus on:
1. Adding or removing features based on their answers
2. Adjusting the tech stack if needed
3. Updating risks and next steps
4. Asking new, more specific questions if needed

Return a refined estimate in the same JSON format as before.`;

    const userPrompt = `Original Project: "${projectDescription}"

Original Estimate Summary: ${originalEstimate.summary}

Client's Answers to Questions:
${answeredQuestionsText || "No specific requirements selected"}

Questions They Said NO to:
${answeredQuestions
  .filter((qa: QuestionAnswer) => qa.answer === "No")
  .map((qa: QuestionAnswer) => `- ${qa.question}`)
  .join("\n")}

Please provide a refined estimate in JSON format with this structure:
{
  "projectName": "Updated project name",
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
  "questions": ["new, more specific questions based on their answers"]
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
