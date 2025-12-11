import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/database/client";
import type { CreateBlueprintInput } from "@/lib/ai/types";

// GET /api/blueprints - Fetch all user's blueprints
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const starred = searchParams.get("starred") === "true";
    const archived = searchParams.get("archived") === "true";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const search = searchParams.get("search");

    // Build query
    let query = supabase
      .from("blueprints")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Apply filters
    if (starred) {
      query = query.eq("is_starred", true);
    }

    if (!archived) {
      query = query.eq("is_archived", false);
    } else {
      query = query.eq("is_archived", true);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    if (search) {
      query = query.or(
        `project_name.ilike.%${search}%,project_description.ilike.%${search}%,summary.ilike.%${search}%`
      );
    }

    const { data: blueprints, error } = await query;

    if (error) {
      console.error("Error fetching blueprints:", error);
      return NextResponse.json(
        { error: "Failed to fetch blueprints" },
        { status: 500 }
      );
    }

    return NextResponse.json({ blueprints });
  } catch (error) {
    console.error("Error in GET /api/blueprints:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blueprints - Create a new blueprint
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CreateBlueprintInput = await request.json();

    // Validate required fields
    if (!body.project_name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Insert blueprint
    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .insert({
        user_id: user.id,
        project_name: body.project_name,
        project_description: body.project_description,
        summary: body.summary,
        features: body.features || [],
        tech_stack: body.tech_stack || {},
        risks: body.risks || [],
        next_steps: body.next_steps || [],
        questions: body.questions || [],
        enhancements: body.enhancements || {},
        tags: body.tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating blueprint:", error);
      return NextResponse.json(
        { error: "Failed to create blueprint" },
        { status: 500 }
      );
    }

    return NextResponse.json({ blueprint }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blueprints:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
