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
    const estimate = await generateProjectEstimate(projectDescription, userPreferences);

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("Error generating estimate:", error);
    return NextResponse.json(
      { error: "Failed to generate estimate. Please try again." },
      { status: 500 }
    );
  }
}
