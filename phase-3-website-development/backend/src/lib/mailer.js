import nodemailer from "nodemailer";

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendVerificationEmail({ to, name, verifyUrl }) {
  if (!hasSmtpConfig()) {
    console.log("=== Email Verification (Fallback Log) ===");
    console.log(`To: ${to}`);
    console.log(`Hello ${name}, verify your account here: ${verifyUrl}`);
    console.log("========================================");
    return;
  }

  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Doctor G - Email Verification",
    text: `Hello ${name},\n\nPlease verify your email by opening this link:\n${verifyUrl}\n\nIf you did not create this account, ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Doctor G - Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">${verifyUrl}</a></p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `
  });
}
