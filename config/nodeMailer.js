import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// 🔥 IMPORTANT: verify connection
transporter.verify((err) => {
    if (err) {
        console.error("❌ SMTP CONNECTION FAILED:", err.message);
    } else {
        console.log("✅ Brevo SMTP connected successfully");
    }
});

/**
 * Send email helper
 */
export const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"Local Service App" <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html,
    });
};

export default transporter;
