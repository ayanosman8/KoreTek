import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('API Route called - checking API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

    const body = await request.json();
    const {
      package: packageName,
      name,
      email,
      company,
      phone,
      industry,
      websiteUrl,
      message,
    } = body;

    const fullName = name || 'Not provided';
    const companyName = company || 'Not provided';
    const projectMessage = message || 'Not provided';
    const industryType = industry || 'Not provided';
    const currentWebsite = websiteUrl || 'No existing website';

    console.log('Form data received:', { packageName, fullName, email, company: companyName, industry: industryType, websiteUrl: currentWebsite });

    // Validate required fields
    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    console.log('Inserting data into Supabase...');
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('form_submissions')
      .insert([
        {
          package: packageName,
          name: fullName,
          email: email,
          company: companyName,
          phone: phone || null,
          industry: industryType,
          website_url: currentWebsite,
          message: projectMessage,
        }
      ])
      .select();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Continue with email even if Supabase fails
    } else {
      console.log('Successfully inserted into Supabase:', supabaseData);
    }

    console.log('Attempting to send email via Resend...');

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'info@korelnx.com', // Your verified domain email
      to: ['aosman@korelnx.com', 'hkore@korelnx.com'], // Your Google Workspace emails
      replyTo: email, // User's email for easy reply
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
                <div class="field-label">Package Interest</div>
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
                <div class="field-label">Company / Project Type</div>
                <div class="field-value">${companyName}</div>
              </div>

              <div class="field">
                <div class="field-label">Industry</div>
                <div class="field-value">${industryType}</div>
              </div>

              <div class="field">
                <div class="field-label">Current Website</div>
                <div class="field-value">
                  ${currentWebsite !== 'No existing website'
                    ? `<a href="${currentWebsite}" style="color: #3b82f6; text-decoration: none;" target="_blank">${currentWebsite}</a>`
                    : currentWebsite
                  }
                </div>
              </div>

              <div class="message-box">
                <div class="field-label">Project Description</div>
                <div class="field-value" style="margin-top: 10px; white-space: pre-wrap;">${projectMessage}</div>
              </div>

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

    // Save to Supabase database
    try {
      const { error: dbError } = await supabase
        .from('form_submissions')
        .insert({
          package: packageName,
          first_name: name ? name.split(' ')[0] : firstName,
          last_name: name ? name.split(' ').slice(1).join(' ') : lastName,
          email: email,
          company: companyName,
          phone: phone || null,
          budget: budget || null,
          timeline: timeline || null,
          message: projectMessage,
          submitted_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Error saving to database:', dbError);
        // Don't fail the request if database save fails, email already sent
      } else {
        console.log('Successfully saved to database');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue - email was sent successfully
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', errorMessage);
    console.error('Error stack:', errorStack);

    // Log full error object for debugging
    if (typeof error === 'object' && error !== null) {
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage, fullError: error },
      { status: 500 }
    );
  }
}
