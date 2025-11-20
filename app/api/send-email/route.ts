import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
      budget,
      timeline,
      message,
      // Legacy fields for backwards compatibility
      organization,
      firstName,
      lastName,
      businessType,
      hasExistingWebsite,
      websiteUrl,
      companyDescription,
      uploadedFiles,
      businessDescription,
      hasExistingBranding,
      platforms,
      appType,
      expectedUsers,
      techStack,
      teamSize,
      compliance,
    } = body;

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
    const companyName = company || organization || 'Not provided';
    const projectMessage = message || companyDescription || 'Not provided';

    console.log('Form data received:', { packageName, fullName, email, company: companyName, budget, timeline });

    // Validate required fields
    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

              ${budget ? `
              <div class="field">
                <div class="field-label">Budget Range</div>
                <div class="field-value">${budget}</div>
              </div>
              ` : ''}

              ${timeline ? `
              <div class="field">
                <div class="field-label">Timeline</div>
                <div class="field-value">${timeline}</div>
              </div>
              ` : ''}

              ${businessType ? `
              <div class="field">
                <div class="field-label">Business Type / Industry</div>
                <div class="field-value">${businessType}</div>
              </div>
              ` : ''}

              ${hasExistingWebsite ? `
              <div class="field">
                <div class="field-label">Has Existing Website</div>
                <div class="field-value">${hasExistingWebsite}</div>
              </div>
              ` : ''}

              ${websiteUrl ? `
              <div class="field">
                <div class="field-label">Current Website URL</div>
                <div class="field-value"><a href="${websiteUrl}" style="color: #3b82f6; text-decoration: none;" target="_blank">${websiteUrl}</a></div>
              </div>
              ` : ''}

              <div class="message-box">
                <div class="field-label">Project Description</div>
                <div class="field-value" style="margin-top: 10px; white-space: pre-wrap;">${projectMessage}</div>
              </div>

              ${uploadedFiles && uploadedFiles.length > 0 ? `
              <div class="field">
                <div class="field-label">Uploaded Files (Logo/Branding)</div>
                <div class="field-value">
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${uploadedFiles.map((file: { name: string; size: string; type: string }) =>
                      `<li>${file.name} (${file.size}, ${file.type})</li>`
                    ).join('')}
                  </ul>
                  <p style="color: #64748b; font-size: 12px; margin-top: 10px;">Note: Files were uploaded but not attached to this email. Please request them from the client if needed.</p>
                </div>
              </div>
              ` : ''}

              ${businessDescription ? `
              <div class="field">
                <div class="field-label">Business Description</div>
                <div class="field-value" style="white-space: pre-wrap;">${businessDescription}</div>
              </div>
              ` : ''}

              ${hasExistingBranding ? `
              <div class="field">
                <div class="field-label">Existing Branding</div>
                <div class="field-value">${hasExistingBranding}</div>
              </div>
              ` : ''}

              ${platforms ? `
              <div class="field">
                <div class="field-label">Platforms Needed</div>
                <div class="field-value">${platforms}</div>
              </div>
              ` : ''}

              ${appType ? `
              <div class="field">
                <div class="field-label">Application Type</div>
                <div class="field-value">${appType}</div>
              </div>
              ` : ''}

              ${expectedUsers ? `
              <div class="field">
                <div class="field-label">Expected Users</div>
                <div class="field-value">${expectedUsers}</div>
              </div>
              ` : ''}

              ${techStack ? `
              <div class="field">
                <div class="field-label">Current Tech Stack</div>
                <div class="field-value">${techStack}</div>
              </div>
              ` : ''}

              ${teamSize ? `
              <div class="field">
                <div class="field-label">Team Size</div>
                <div class="field-value">${teamSize}</div>
              </div>
              ` : ''}

              ${compliance ? `
              <div class="field">
                <div class="field-label">Compliance Requirements</div>
                <div class="field-value">${compliance}</div>
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
