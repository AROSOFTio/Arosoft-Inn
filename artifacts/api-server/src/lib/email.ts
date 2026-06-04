import nodemailer from "nodemailer";

interface SupportReplyEmailInput {
  to: string;
  subject: string;
  body: string;
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
}

export async function sendSupportReplyEmail(input: SupportReplyEmailInput) {
  if (!smtpConfigured()) {
    return {
      sent: false,
      skippedReason: "SMTP is not configured.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    text: input.body,
  });

  return {
    sent: true,
    skippedReason: null,
  };
}
