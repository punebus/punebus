const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const buildFromAddress = () =>
  process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) {
    return { sent: false, reason: "missing-recipient" };
  }

  if (!hasSmtpConfig()) {
    console.warn(`Email skipped for ${to}: SMTP_HOST, SMTP_USER or SMTP_PASS missing`);
    return { sent: false, reason: "missing-smtp-config" };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: buildFromAddress(),
      to,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    console.error("Email send failed:", error.message || error);
    return { sent: false, reason: error.message || "send-failed" };
  }
};
