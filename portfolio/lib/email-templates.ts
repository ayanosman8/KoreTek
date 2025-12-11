// KoreLnx Email Templates

const baseStyles = `
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 40px; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 32px; }
  .logo { font-size: 28px; font-weight: 300; color: #fff; letter-spacing: 1px; }
  .logo span { color: #3b82f6; }
  .content { background: linear-gradient(to bottom right, #111, #000); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; }
  h1 { font-weight: 300; font-size: 24px; color: #fff; margin: 0 0 20px 0; }
  p { color: rgba(255,255,255,0.8); font-weight: 300; line-height: 1.7; margin: 0 0 16px 0; font-size: 16px; }
  .highlight { color: #22d3ee; }
  .button { display: inline-block; background: linear-gradient(to right, #3b82f6, #2563eb); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 500; margin-top: 24px; }
  .signature { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 14px; }
`;

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Kore<span>Lnx</span></div>
    </div>
    <div class="content">
      ${content}
    </div>
  </div>
</body>
</html>
`;

// 1. Welcome Email – After Intake Form Submission
export const welcomeEmail = (clientName: string) => ({
  subject: "Welcome to KoreLnx!",
  from: "KoreLnx <info@korelnx.com>",
  html: emailWrapper(`
    <h1>Welcome, ${clientName}!</h1>
    <p>Thanks for filling out our intake form! We're excited to get started on your project.</p>
    <p>One of our team members will review your info and reach out to you soon.</p>
    <p>Let's make something amazing!</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// 2. Request Info Form Submission – Acknowledgment
export const requestAcknowledgmentEmail = (clientName: string) => ({
  subject: "Got Your Request",
  from: "KoreLnx <info@korelnx.com>",
  html: emailWrapper(`
    <h1>Hi ${clientName},</h1>
    <p>We got your request! Someone from KoreLnx will be in touch.</p>
    <p>Talk soon,</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// 3. Project Start Notification
export const projectStartEmail = (clientName: string, projectName: string) => ({
  subject: "Your Project is Live!",
  from: "KoreLnx Projects <projects@korelnx.com>",
  html: emailWrapper(`
    <h1>Hi ${clientName},</h1>
    <p>Your project, <span class="highlight">${projectName}</span>, is officially underway!</p>
    <p>Our team is diving in and we'll keep you updated along the way.</p>
    <p>Have new info or questions? Just hit reply.</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// 4. Project Prototype Ready for Review
export const prototypeReadyEmail = (clientName: string, projectName: string, reviewLink: string) => ({
  subject: "Your Project Prototype is Ready",
  from: "KoreLnx Projects <projects@korelnx.com>",
  html: emailWrapper(`
    <h1>Hi ${clientName},</h1>
    <p>Your project, <span class="highlight">${projectName}</span>, has a prototype ready for review!</p>
    <p>We'd love for you to check it out and share your feedback so we can make it perfect.</p>
    <a href="${reviewLink}" class="button">Review Prototype</a>
    <p style="margin-top: 32px;">Please provide all feedback so we can refine and finalize your project.</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// 5. Project Completion Notification
export const projectCompleteEmail = (clientName: string, projectName: string, deliverableLink: string) => ({
  subject: "Your Project is Ready",
  from: "KoreLnx Projects <projects@korelnx.com>",
  html: emailWrapper(`
    <h1>Hi ${clientName},</h1>
    <p>Your project, <span class="highlight">${projectName}</span>, is complete!</p>
    <p>Check out your final deliverables below. We hope you love it!</p>
    <a href="${deliverableLink}" class="button">View Deliverables</a>
    <p style="margin-top: 32px;">We can't wait to hear your thoughts.</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// 6. Thank You / Offboarding + Feedback Survey
export const thankYouEmail = (clientName: string, surveyLink: string) => ({
  subject: "Thanks for Working With Us",
  from: "KoreLnx <team@korelnx.com>",
  html: emailWrapper(`
    <h1>Hi ${clientName},</h1>
    <p>Thanks for choosing KoreLnx! We hope you enjoyed working with us.</p>
    <p>We'd love your feedback to keep improving:</p>
    <a href="${surveyLink}" class="button">Share Feedback</a>
    <p style="margin-top: 32px;">Looking forward to collaborating again soon!</p>
    <div class="signature">
      – The KoreLnx Team
    </div>
  `),
});

// Internal notification when a new submission comes in
export const internalNotificationEmail = (submission: {
  clientName: string;
  email: string;
  company?: string;
  projectDescription?: string;
  packageTier?: string;
}) => ({
  subject: `New Submission: ${submission.clientName}${submission.company ? ` (${submission.company})` : ''}`,
  from: "KoreLnx System <notifications@korelnx.com>",
  html: emailWrapper(`
    <h1>New Client Submission</h1>
    <p><strong>Name:</strong> ${submission.clientName}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
    ${submission.packageTier ? `<p><strong>Package:</strong> <span class="highlight">${submission.packageTier}</span></p>` : ''}
    ${submission.projectDescription ? `<p><strong>Project:</strong> ${submission.projectDescription}</p>` : ''}
    <div class="signature">
      – KoreLnx Notification System
    </div>
  `),
});
