"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegistrationEmail = sendRegistrationEmail;
exports.sendContactDetails = sendContactDetails;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendRegistrationEmail(email) {
    try {
        // Create a transporter using your email service credentials
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail", // service provider
            auth: {
                user: "srinivas72075@gmail.com",
                pass: "ifhp vypf rhqb ubpw",
            },
        });
        // Email content
        const mailOptions = {
            from: "srinivas72075@gmail.com",
            to: email,
            subject: "Welcome, you are a member of our App now...",
            html: `
       You have successfully registered
       with us ${email}, Login and 
       develop your portfolio efficiently...
      `,
        };
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent:", info.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
async function sendContactDetails(name, countryCode, phone, email, profession) {
    try {
        // Create a transporter using your email service credentials
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail", // service provider
            auth: {
                user: "srinivas72075@gmail.com",
                pass: "ifhp vypf rhqb ubpw",
            },
        });
        // Email content
        const mailOptions = {
            from: "srinivas72075@gmail.com",
            to: "srinivas72075@gmail.com",
            subject: "I wanna know more about this, can we connect ???",
            html: `
       Name: ${name} <br/>
		 Phone: ${countryCode} ${phone} <br/>
		 Email: ${email} <br/>
		 Profession: ${profession} <br/>
      `,
        };
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent:", info.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
