import nodemailer, { SendMailOptions } from "nodemailer";

// -----------------------------
// Create Gmail transporter
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,   // your Gmail
    pass: process.env.SMTP_PASS,   // Gmail App Password (16-char)
  },
});

// -----------------------------
// Send Contact Details Email
// -----------------------------
export async function sendContactDetails(
  name: string,
  countryCode: string,
  phone: string,
  email: string,
  profession: string
) {
  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_USER,
    to: "srinivas72075@gmail.com",
    subject: "I wanna know more about this, can we connect ???",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Profession:</strong> ${profession}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// -----------------------------
// Send Registration Welcome Email
// -----------------------------
export async function sendRegistrationEmail(email: string) {
  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Welcome, you are a member of our App now...",
    html: `
      <p>You have successfully registered with us <strong>${email}</strong>.</p>
      <p>Login and develop your portfolio efficiently...</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
