import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProposalPDF, ProposalData } from '@/components/ProposalPDF';
import { createClient } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { blueprintId, clientInfo, pricing, customSettings } = body;

    if (!blueprintId || !clientInfo?.name) {
      return NextResponse.json(
        { error: 'Blueprint ID and client name are required' },
        { status: 400 }
      );
    }

    // Fetch blueprint data
    const { data: blueprint, error: blueprintError } = await supabase
      .from('blueprints')
      .select('*')
      .eq('id', blueprintId)
      .single();

    if (blueprintError || !blueprint) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      );
    }

    // Verify ownership or collaboration
    if (blueprint.user_id !== user.id) {
      // Check if user is a collaborator
      const { data: collaboration } = await supabase
        .from('blueprint_collaborators')
        .select('*')
        .eq('blueprint_id', blueprintId)
        .eq('email', user.email)
        .single();

      if (!collaboration) {
        return NextResponse.json(
          { error: 'You do not have access to this blueprint' },
          { status: 403 }
        );
      }
    }

    // Fetch user's company info from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, company_logo, company_email, company_phone, company_address, company_website')
      .eq('id', user.id)
      .single();

    // Fetch user's proposal settings
    const { data: settings } = await supabase
      .from('proposal_settings')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_name', customSettings?.templateName || 'default')
      .single();

    // Prepare features with pricing
    const features = blueprint.features?.map((feature: any, index: number) => ({
      name: feature.name || `Feature ${index + 1}`,
      description: feature.description || '',
      tier: feature.tier || 'free',
      price: pricing?.featurePrices?.[index] || 0,
    })) || [];

    // Calculate total price
    const totalPrice = pricing?.totalPrice || features.reduce((sum: number, f: any) => sum + (f.price || 0), 0);

    // Build proposal data
    const proposalData: ProposalData = {
      // Project info
      projectName: blueprint.project_name || 'Untitled Project',
      summary: blueprint.summary || 'No summary provided.',

      // Client info
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientCompany: clientInfo.company,

      // Company info
      companyName: customSettings?.companyName || profile?.company_name || undefined,
      companyLogo: customSettings?.companyLogo || profile?.company_logo || undefined,
      companyEmail: customSettings?.companyEmail || profile?.company_email || undefined,
      companyPhone: customSettings?.companyPhone || profile?.company_phone || undefined,
      companyAddress: customSettings?.companyAddress || profile?.company_address || undefined,
      companyWebsite: customSettings?.companyWebsite || profile?.company_website || undefined,

      // Features and tech
      features,
      techStack: blueprint.tech_stack || {},

      // Pricing
      totalPrice,

      // Timeline
      estimatedTimeline: pricing?.estimatedTimeline,
      milestones: pricing?.milestones,

      // Terms
      paymentTerms: customSettings?.paymentTerms || settings?.payment_terms || 'Payment terms to be discussed.',
      termsAndConditions: customSettings?.termsAndConditions || settings?.terms_and_conditions || 'Standard terms and conditions apply.',

      // Branding
      primaryColor: customSettings?.primaryColor || settings?.primary_color || '#3b82f6',
    };

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(ProposalPDF, { data: proposalData })
    );

    // Optionally save proposal to database
    if (pricing?.saveToDatabase !== false) {
      await supabase.from('proposals').insert({
        user_id: user.id,
        blueprint_id: blueprintId,
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_company: clientInfo.company,
        total_price: totalPrice,
        status: 'draft',
      });
    }

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${blueprint.project_name || 'proposal'}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating proposal:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
