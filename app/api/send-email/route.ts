import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('API Route called - checking API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

    const body = await request.json();
    const {
      package: packageName,
      firstName,
      lastName,
      email,
      projectType,
      company,
      phone,
      industry,
      hasWebsite,
      websiteUrl,
      message,
    } = body;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Not provided';
    const companyName = company || null;
    const projectMessage = message || null;
    const industryType = industry || null;
    const currentWebsite = websiteUrl || null;

    console.log('Form data received:', { packageName, fullName, email, projectType, company: companyName, industry: industryType });

    // Validate required fields
    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase (using admin client to bypass RLS) - only if configured
    if (supabaseAdmin) {
      console.log('Inserting data into Supabase...');
      const { data: supabaseData, error: supabaseError } = await supabaseAdmin
        .from('form_submissions')
        .insert({
          package: packageName,
          first_name: firstName,
          last_name: lastName || null,
          email: email,
          company: companyName,
          phone: phone || null,
          budget: null,
          timeline: null,
          message: projectMessage,
        })
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
      } else {
        console.log('Successfully inserted into Supabase:', supabaseData);
      }
    } else {
      console.log('Supabase not configured, skipping database insert');
    }

    console.log('Attempting to send email via Resend...');

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'info@korelnx.com',
      to: ['info@korelnx.com'],
      replyTo: email,
      subject: `New KoreLnx Inquiry: ${packageName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .field-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 5px; }
            .field-value { font-size: 16px; color: #1e293b; }
            .message-box { background: white; padding: 20px; margin-top: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Inquiry from KoreLnx Website</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Service Needed</div>
                <div class="field-value">${packageName}</div>
              </div>

              <div class="field">
                <div class="field-label">Contact Name</div>
                <div class="field-value">${fullName}</div>
              </div>

              <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
              </div>

              ${phone ? `
              <div class="field">
                <div class="field-label">Phone Number</div>
                <div class="field-value">${phone}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="field-label">Project Type</div>
                <div class="field-value">${projectType === 'personal' ? 'Personal Project' : 'Company Project'}</div>
              </div>

              ${companyName ? `
              <div class="field">
                <div class="field-label">Company Name</div>
                <div class="field-value">${companyName}</div>
              </div>
              ` : ''}

              ${industryType ? `
              <div class="field">
                <div class="field-label">Industry</div>
                <div class="field-value">${industryType}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="field-label">Has Existing Website</div>
                <div class="field-value">${hasWebsite === 'yes' ? 'Yes' : 'No'}</div>
              </div>

              ${currentWebsite ? `
              <div class="field">
                <div class="field-label">Current Website</div>
                <div class="field-value"><a href="${currentWebsite}" style="color: #3b82f6; text-decoration: none;" target="_blank">${currentWebsite}</a></div>
              </div>
              ` : ''}

              ${projectMessage ? `
              <div class="message-box">
                <div class="field-label">Additional Notes</div>
                <div class="field-value" style="margin-top: 10px; white-space: pre-wrap;">${projectMessage}</div>
              </div>
              ` : ''}

              <div class="footer">
                <p>Reply directly to this email to respond to <strong>${fullName}</strong></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', data);

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage },
      { status: 500 }
    );
  }
}
