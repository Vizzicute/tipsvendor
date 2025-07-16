import { sendMail } from "./mail";

export async function verificationMail(
  email: string,
  name: string,
  link: string
) {
  const mail = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 0;">
      <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${
            process.env.NEXT_PUBLIC_APP_URL
          }/logo-2.png" width="250" alt="Email Icon" style="margin-bottom: 12px;" />
          <h2 style="margin: 0; color: #2563eb;">Verify Your Email</h2>
        </div>
        <div style="color: #374151; font-size: 16px; margin-bottom: 16px;">
          Hello${name ? `, <b>${name}</b>` : ""}!
        </div>
        <div style="color: #374151; font-size: 15px; margin-bottom: 16px;">
          Thank you for signing up on ${process.env.NEXT_PUBLIC_APP_SHORT_TITLE}, the best Prediction Platform. Please verify your email address to activate your account.
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${link}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Verify Email
          </a>
        </div>
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
          If you did not create an account, you can safely ignore this email.
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          Thank you,<br/>The Tipsvendor Team
        </div>
      </div>
    </div>
  `;
  try {
    await sendMail({
      to: email,
      subject: "Verify your email address",
      html: mail,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
