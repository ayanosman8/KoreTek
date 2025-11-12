import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('API Route called - checking API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

    const body = await request.json();
    const { package: packageName, organization, name, email, phone, message } = body;

    console.log('Form data received:', { packageName, organization, name, email });

    // Validate required fields
    if (!packageName || !organization || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Attempting to send email via Resend...');

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Resend's test email
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

    console.log('Email sent successfully:', data);

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage },
      { status: 500 }
    );
  }
}
