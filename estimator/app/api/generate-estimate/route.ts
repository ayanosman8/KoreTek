import { NextRequest, NextResponse } from "next/server";
import { generateProjectEstimate } from "@/lib/ai/estimator";
import { createClient } from "@/lib/auth/server";

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

    // Try to get user's tech preferences if they're logged in
    let userPreferences = undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tech_preferences')
          .eq('id', user.id)
          .single();

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
    console.log('Generating estimate for:', projectDescription.substring(0, 100));
    const estimate = await generateProjectEstimate(projectDescription, userPreferences);
    console.log('Successfully generated estimate');

    return NextResponse.json({ estimate });
  } catch (error: any) {
    console.error("Error generating estimate:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { error: error?.message || "Failed to generate estimate. Please try again." },
      { status: 500 }
    );
  }
}
