import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth/server";
import type { UpdateBlueprintInput } from "@/lib/ai/types";

// GET /api/blueprints/[id] - Fetch a single blueprint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blueprint });
  } catch (error) {
    console.error("Error in GET /api/blueprints/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/blueprints/[id] - Update a blueprint
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: UpdateBlueprintInput = await request.json();

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (body.project_name !== undefined) updateData.project_name = body.project_name;
    if (body.project_description !== undefined) updateData.project_description = body.project_description;
    if (body.summary !== undefined) updateData.summary = body.summary;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.tech_stack !== undefined) updateData.tech_stack = body.tech_stack;
    if (body.risks !== undefined) updateData.risks = body.risks;
    if (body.next_steps !== undefined) updateData.next_steps = body.next_steps;
    if (body.questions !== undefined) updateData.questions = body.questions;
    if (body.enhancements !== undefined) updateData.enhancements = body.enhancements;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.is_starred !== undefined) updateData.is_starred = body.is_starred;
    if (body.is_archived !== undefined) updateData.is_archived = body.is_archived;

    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !blueprint) {
      console.error("Error updating blueprint:", error);
      return NextResponse.json(
        { error: "Failed to update blueprint" },
        { status: 500 }
      );
    }

    return NextResponse.json({ blueprint });
  } catch (error) {
    console.error("Error in PATCH /api/blueprints/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/blueprints/[id] - Delete a blueprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { error } = await supabase
      .from("blueprints")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting blueprint:", error);
      return NextResponse.json(
        { error: "Failed to delete blueprint" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/blueprints/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
