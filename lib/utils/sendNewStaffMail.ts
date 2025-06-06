import { sendMail } from "./mail";

export async function newStaffMail(
  name: string,
  email: string,
  link: string,
  role: string
) {
  const mail = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 0;">
      <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${
            process.env.NEXT_PUBLIC_APP_URL
          }/logo-2.png" width="64" alt="Team Icon" style="margin-bottom: 12px;" />
          <h2 style="margin: 0; color: #2563eb;">Welcome to the Team!</h2>
        </div>
        <div style="color: #374151; font-size: 16px; margin-bottom: 16px;">
          Hello${name ? `, <b> ${name}</b>` : ""}!
        </div>
        <div style="color: #374151; font-size: 15px; margin-bottom: 16px;">
          You have been added as a staff member. Please set your password to activate your account.
        </div>
        <div style="background: #f1f5f9; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
          <div><strong>Email:</strong> ${email}</div>
          <div style="color: #374151; text-transform: capitalize;"><strong>Role:</strong> ${role}</div>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${link}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Set Your Password
          </a>
        </div>
        <div style="color: #374151; font-size: 15px; margin-bottom: 8px;">
          For security, please change your password after your first login.
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          Welcome aboard!<br/>The TipsVendor Team
        </div>
      </div>
    </div>
  `;
  try {
      await sendMail({
        to: email,
        subject: "TipsVendor: Staff Access Invitation",
        html: mail,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
}
