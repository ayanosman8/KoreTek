import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@repo/database/client";
import type { ProjectEstimate } from "@repo/ai/types";

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, estimate } = await request.json();

    if (!projectDescription || !estimate) {
      return NextResponse.json(
        { error: "Project description and estimate are required" },
        { status: 400 }
      );
    }

    // Save to estimates table (for analytics)
    const { data, error } = await supabase
      .from("estimates")
      .insert([
        {
          project_description: projectDescription,
          estimate: estimate,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, estimateId: data.id });
  } catch (error) {
    console.error("Error saving estimate:", error);
    return NextResponse.json(
      { error: "Failed to save estimate" },
      { status: 500 }
    );
  }
}
