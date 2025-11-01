import nodemailer, {
	Transporter,
	SendMailOptions,
	SentMessageInfo,
} from "nodemailer";

export async function sendRegistrationEmail(email: string): Promise<void> {
	try {
		// Create a transporter using your email service credentials
		const transporter: Transporter = nodemailer.createTransport({
			service: "Gmail", // service provider
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "ifhp vypf rhqb ubpw",
			},
		});

		// Email content
		const mailOptions: SendMailOptions = {
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
		const info: SentMessageInfo = await transporter.sendMail(mailOptions);
		// console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

export async function sendContactDetails(
	name: string,
	countryCode: string,
	phone: string,
	email: string,
	profession: string
): Promise<void> {
	try {
		// Create a transporter using your email service credentials
		const transporter: Transporter = nodemailer.createTransport({
			service: "Gmail", // service provider
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "ifhp vypf rhqb ubpw",
			},
		});

		// Email content
		const mailOptions: SendMailOptions = {
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
		const info: SentMessageInfo = await transporter.sendMail(mailOptions);
		// console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}
