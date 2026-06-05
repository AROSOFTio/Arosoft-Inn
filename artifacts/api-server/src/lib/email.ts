import nodemailer from "nodemailer";

export interface EmailResult {
  sent: boolean;
  skippedReason: string | null;
}

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_FROM_EMAIL,
  );
}

function fromAddress() {
  const email = process.env.SMTP_FROM_EMAIL;
  const name = process.env.SMTP_FROM_NAME || "AROSOFT Labs";
  return name && email ? `${name} <${email}>` : email;
}

function adminInbox() {
  return process.env.SMTP_FROM_EMAIL || "info@arosoftlabs.com";
}

async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
  if (!smtpConfigured()) {
    const skippedReason = "SMTP is not configured.";
    console.info({ to: input.to, subject: input.subject, skippedReason }, "email skipped");
    return { sent: false, skippedReason };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return { sent: true, skippedReason: null };
  } catch (error) {
    const skippedReason = error instanceof Error ? error.message : "Email failed.";
    console.warn({ to: input.to, subject: input.subject, skippedReason }, "email failed");
    return { sent: false, skippedReason };
  }
}

function paragraph(value: string) {
  return `<p style="margin:0 0 12px;color:#334155;line-height:1.6">${value}</p>`;
}

function renderEmail(title: string, body: string[]) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:24px">
        <h1 style="margin:0 0 16px;color:#0f172a;font-size:22px">${title}</h1>
        ${body.map(paragraph).join("")}
        <p style="margin:20px 0 0;color:#64748b;font-size:12px">AROSOFT Labs / Operated by AROSOFT Innovations Ltd</p>
      </div>
    </div>
  `;
}

export async function sendContactConfirmationEmail(input: { to: string; name: string; subject: string }) {
  const text = `Hello ${input.name},\n\nWe received your message: ${input.subject}.\nOur team will review it and respond from the support inbox.\n\nAROSOFT Labs`;
  return sendEmail({
    to: input.to,
    subject: "We received your message",
    text,
    html: renderEmail("We received your message", [
      `Hello ${input.name},`,
      `We received your message: ${input.subject}.`,
      "Our team will review it and respond from the support inbox.",
    ]),
  });
}

export async function sendSupportReplyEmail(input: { to: string; subject: string; body: string }) {
  return sendEmail({
    to: input.to,
    subject: input.subject,
    text: input.body,
    html: renderEmail(input.subject, [input.body]),
  });
}

export async function sendClientRequestConfirmationEmail(input: { to: string; name: string; title: string }) {
  return sendEmail({
    to: input.to,
    subject: "Your request was received",
    text: `Hello ${input.name},\n\nYour request "${input.title}" was received and is ready for admin review.\n\nAROSOFT Labs`,
    html: renderEmail("Your request was received", [
      `Hello ${input.name},`,
      `Your request "${input.title}" was received and is ready for admin review.`,
    ]),
  });
}

export async function sendAdminRequestAlertEmail(input: { clientName: string; title: string; serviceType: string }) {
  return sendEmail({
    to: adminInbox(),
    subject: "New client request received",
    text: `New request: ${input.title}\nClient: ${input.clientName}\nService: ${input.serviceType}`,
    html: renderEmail("New client request received", [
      `Request: ${input.title}`,
      `Client: ${input.clientName}`,
      `Service: ${input.serviceType}`,
    ]),
  });
}

export async function sendTaskAssignmentEmail(input: { to: string; name: string; title: string; priority: string }) {
  return sendEmail({
    to: input.to,
    subject: "New task assigned",
    text: `Hello ${input.name},\n\nYou have a new task: ${input.title}\nPriority: ${input.priority}`,
    html: renderEmail("New task assigned", [
      `Hello ${input.name},`,
      `You have a new task: ${input.title}`,
      `Priority: ${input.priority}`,
    ]),
  });
}

export async function sendInvoiceNotificationEmail(input: { to: string; name: string; invoiceNumber: string; amount: string }) {
  return sendEmail({
    to: input.to,
    subject: `Invoice ${input.invoiceNumber}`,
    text: `Hello ${input.name},\n\nInvoice ${input.invoiceNumber} for ${input.amount} has been sent.`,
    html: renderEmail(`Invoice ${input.invoiceNumber}`, [
      `Hello ${input.name},`,
      `Invoice ${input.invoiceNumber} for ${input.amount} has been sent.`,
    ]),
  });
}

export async function sendCourseEnrollmentEmail(input: { to: string; name: string; courseTitle: string }) {
  return sendEmail({
    to: input.to,
    subject: "Course enrollment confirmed",
    text: `Hello ${input.name},\n\nYou are enrolled in ${input.courseTitle}. Open My Learning to start.`,
    html: renderEmail("Course enrollment confirmed", [
      `Hello ${input.name},`,
      `You are enrolled in ${input.courseTitle}. Open My Learning to start.`,
    ]),
  });
}

export async function sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }) {
  return sendEmail({
    to: input.to,
    subject: "Reset your AROSOFT password",
    text: `Hello ${input.name},\n\nUse this link to reset your password: ${input.resetUrl}\nThis link expires soon.`,
    html: renderEmail("Reset your AROSOFT password", [
      `Hello ${input.name},`,
      `Use this link to reset your password: ${input.resetUrl}`,
      "This link expires soon.",
    ]),
  });
}
