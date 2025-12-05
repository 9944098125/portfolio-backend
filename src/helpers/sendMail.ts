// file: emailSendgridService.ts
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (!SENDGRID_API_KEY) {
  throw new Error("Missing SENDGRID_API_KEY environment variable");
}
if (!FROM_EMAIL) {
  throw new Error("Missing SENDGRID_FROM_EMAIL environment variable");
}

// Type assertion: FROM_EMAIL is guaranteed to be a string after the check above
const FROM_EMAIL_STRING: string = FROM_EMAIL;

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send contact details to your admin email
 */
export async function sendContactDetails(
  name: string,
  countryCode: string,
  phone: string,
  email: string,
  profession: string,
  message?: string
) {
  const msg = {
    to: "srinivas72075@gmail.com",
    from: FROM_EMAIL_STRING,
    subject: "I wanna know more about this, can we connect ???",
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(countryCode)} ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Profession:</strong> ${escapeHtml(profession)}</p>
      ${message ? `<p><strong>Message:</strong> ${escapeHtml(message)}</p>` : ''}
    `,
  };

  try {
    const result = await sgMail.send(msg);
    return result;
  } catch (err) {
    // Re-throw with more context
    console.error("SendGrid sendContactDetails error:", err);
    throw err;
  }
}

/**
 * Send welcome / registration email to the user
 */
export async function sendRegistrationEmail(recipientEmail: string) {
  const msg = {
    to: recipientEmail,
    from: FROM_EMAIL_STRING,
    subject: "Welcome, you are a member of our App now...",
    html: `
      <p>You have successfully registered with us <strong>${escapeHtml(recipientEmail)}</strong>.</p>
      <p>Login and develop your portfolio efficiently...</p>
    `,
  };

  try {
    const result = await sgMail.send(msg);
    return result;
  } catch (err) {
    console.error("SendGrid sendRegistrationEmail error:", err);
    throw err;
  }
}

/** Minimal HTML escaping to avoid injection through values */
function escapeHtml(input: string | undefined | null) {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
