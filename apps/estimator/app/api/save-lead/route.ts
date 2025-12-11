import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@repo/database/client";

export async function POST(request: NextRequest) {
  try {
    const { name, email, projectDescription, estimate } = await request.json();

    if (!email || !projectDescription) {
      return NextResponse.json(
        { error: "Email and project description are required" },
        { status: 400 }
      );
    }

    // Save to Supabase (using snake_case for database columns)
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          project_description: projectDescription,
          estimate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // TODO: Send email with proposal PDF
    // This is where you'd integrate with Resend or another email service

    return NextResponse.json({ success: true, leadId: data.id });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
