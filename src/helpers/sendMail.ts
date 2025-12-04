import nodemailer, {
	Transporter,
	SendMailOptions,
	SentMessageInfo,
} from "nodemailer";

// Singleton transporter - created once and reused for all email requests
// This significantly improves performance by reusing connections
let transporterInstance: Transporter | null = null;

function getTransporter(): Transporter {
	if (!transporterInstance) {
		// Use explicit Gmail SMTP configuration for better reliability in hosted environments
		// Using explicit host/port instead of 'service' for better control over timeouts
		transporterInstance = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, // true for 465, false for other ports
			requireTLS: true, // Force TLS
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "wfbr cwrv daxy tgzb",
			},
			// Connection pool settings (disabled for better compatibility in hosted environments)
			pool: false, // Disable pooling to avoid connection issues
			// Increased timeouts for hosted environments with network latency
			connectionTimeout: 30000, // 30 seconds - increased for hosted environments
			greetingTimeout: 30000, // 30 seconds - increased for hosted environments
			socketTimeout: 60000, // 60 seconds - increased for hosted environments
			// Additional options for better reliability
			debug: false, // Set to true for debugging
			logger: false, // Set to true for logging
		} as any); // Type assertion needed due to nodemailer type definitions

		// Verify transporter connection on startup (non-blocking)
		// Disabled verification to prevent startup issues if SMTP is temporarily unavailable
		transporterInstance.verify((error, success) => {
			if (error) {
				console.warn("Email transporter verification failed (non-critical):", error.message);
				console.warn("Email will still attempt to send on demand.");
			} else {
				console.log("✅ Email transporter ready");
			}
		});
	}
	return transporterInstance;
}

export async function sendRegistrationEmail(email: string): Promise<void> {
	const maxRetries = 2;
	let lastError: any;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const transporter = getTransporter();

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

			// Send the email with timeout
			const sendPromise = transporter.sendMail(mailOptions);
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Email send timeout after 45 seconds")), 45000);
			});

			const info: SentMessageInfo = await Promise.race([sendPromise, timeoutPromise]) as SentMessageInfo;
			console.log(`Registration email sent successfully (attempt ${attempt}):`, info.messageId);
			return; // Success, exit function
		} catch (error: any) {
			lastError = error;
			const isTimeoutError = 
				error?.code === "ETIMEDOUT" || 
				error?.code === "ECONNRESET" ||
				error?.message?.includes("timeout") ||
				error?.message?.includes("Connection timeout");

			if (isTimeoutError && attempt < maxRetries) {
				const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s
				console.warn(`Registration email attempt ${attempt} failed (timeout). Retrying in ${waitTime}ms...`, error.message);
				await new Promise(resolve => setTimeout(resolve, waitTime));
				
				// Reset transporter instance to force new connection
				transporterInstance = null;
				continue;
			} else {
				console.error(`Error sending registration email (attempt ${attempt}):`, error);
				if (attempt === maxRetries) {
					// Reset transporter for next request
					transporterInstance = null;
				}
				throw error;
			}
		}
	}

	// This should never be reached, but TypeScript needs it
	throw lastError || new Error("Failed to send email after retries");
}

export async function sendContactDetails(
	name: string,
	countryCode: string,
	phone: string,
	email: string,
	profession: string
): Promise<void> {
	const maxRetries = 2;
	let lastError: any;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const transporter = getTransporter();

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

			// Send the email with timeout
			const sendPromise = transporter.sendMail(mailOptions);
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Email send timeout after 45 seconds")), 45000);
			});

			const info: SentMessageInfo = await Promise.race([sendPromise, timeoutPromise]) as SentMessageInfo;
			console.log(`Email sent successfully (attempt ${attempt}):`, info.messageId);
			return; // Success, exit function
		} catch (error: any) {
			lastError = error;
			const isTimeoutError = 
				error?.code === "ETIMEDOUT" || 
				error?.code === "ECONNRESET" ||
				error?.message?.includes("timeout") ||
				error?.message?.includes("Connection timeout");

			if (isTimeoutError && attempt < maxRetries) {
				const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s
				console.warn(`Email send attempt ${attempt} failed (timeout). Retrying in ${waitTime}ms...`, error.message);
				await new Promise(resolve => setTimeout(resolve, waitTime));
				
				// Reset transporter instance to force new connection
				transporterInstance = null;
				continue;
			} else {
				console.error(`Error sending contact email (attempt ${attempt}):`, error);
				if (attempt === maxRetries) {
					// Reset transporter for next request
					transporterInstance = null;
				}
				throw error;
			}
		}
	}

	// This should never be reached, but TypeScript needs it
	throw lastError || new Error("Failed to send email after retries");
}
