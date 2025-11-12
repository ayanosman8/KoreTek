import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { package: packageName, organization, name, email, phone, message } = body;

    // Validate required fields
    if (!packageName || !organization || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'KoreTek Contact Form <onboarding@resend.dev>', // Change this to your verified domain
      to: ['ayanosman8@gmail.com'], // Your email
      replyTo: email, // User's email for easy reply
      subject: `New Inquiry: ${packageName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Package Interest:</strong> ${packageName}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `,
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
