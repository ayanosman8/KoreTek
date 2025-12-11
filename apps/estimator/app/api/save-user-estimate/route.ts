import { NextResponse } from "next/server";
import { createClient } from "@repo/auth/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has paid
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('has_paid')
      .eq('id', user.id)
      .single();

    if (!profile?.has_paid) {
      return NextResponse.json(
        { error: "Payment required" },
        { status: 403 }
      );
    }

    const { projectDescription, estimate } = await request.json();

    // Save the estimate
    const { data, error } = await supabase
      .from('user_estimates')
      .insert({
        user_id: user.id,
        project_description: projectDescription,
        estimate: estimate,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving estimate:", error);
      return NextResponse.json(
        { error: "Failed to save estimate" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
