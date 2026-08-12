import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "Folifod <onboarding@resend.dev>";

export async function sendAdminInviteEmail({
  to,
  inviteUrl,
}: {
  to: string;
  inviteUrl: string;
}) {
  if (!resendApiKey) {
    console.warn(
      `[email] RESEND_API_KEY missing. Invite link for ${to}: ${inviteUrl}`,
    );
    return { skipped: true as const };
  }

  const resend = new Resend(resendApiKey);
  const result = await resend.emails.send({
    from: emailFrom,
    to,
    subject: "You're invited to the Folifod admin dashboard",
    html: `
      <p>You've been invited to manage content on the Folifod admin dashboard.</p>
      <p><a href="${inviteUrl}">Accept invite and set your password</a></p>
      <p>This link expires in 72 hours.</p>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { skipped: false as const, id: result.data?.id };
}
