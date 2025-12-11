import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Team email for internal notifications
export const TEAM_EMAIL = 'team@korelnx.com';

// Helper to send emails
export async function sendEmail({
  to,
  subject,
  from,
  html,
}: {
  to: string | string[];
  subject: string;
  from: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
