import { NextRequest, NextResponse } from "next/server";
import { generateProjectEstimate } from "@repo/ai/estimator";

export async function POST(request: NextRequest) {
  try {
    const { projectDescription } = await request.json();

    if (!projectDescription || typeof projectDescription !== "string") {
      return NextResponse.json(
        { error: "Project description is required" },
        { status: 400 }
      );
    }

    if (projectDescription.length < 20) {
      return NextResponse.json(
        { error: "Please provide a more detailed project description (at least 20 characters)" },
        { status: 400 }
      );
    }

    // Generate estimate using OpenRouter + Claude
    const estimate = await generateProjectEstimate(projectDescription);

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("Error generating estimate:", error);
    return NextResponse.json(
      { error: "Failed to generate estimate. Please try again." },
      { status: 500 }
    );
  }
}
