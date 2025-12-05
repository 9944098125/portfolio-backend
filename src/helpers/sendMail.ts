import nodemailer, {
	Transporter,
	SendMailOptions,
	SentMessageInfo,
} from "nodemailer";

// Singleton transporter - created once and reused for all email requests
// This significantly improves performance by reusing connections
let transporterInstance: Transporter | null = null;
let usePort465 = false; // Track which port we're using

function getTransporter(reset: boolean = false): Transporter {
	if (!transporterInstance || reset) {
		// Use explicit Gmail SMTP configuration for better reliability in hosted environments
		// Try port 587 (TLS) first, fallback to 465 (SSL) if needed
		const port = usePort465 ? 465 : 587;
		const secure = usePort465;
		
		transporterInstance = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: port,
			secure: secure, // true for 465 (SSL), false for 587 (TLS)
			requireTLS: !secure, // Force TLS only for port 587
			auth: {
				user: "srinivas72075@gmail.com",
				pass: "wfbr cwrv daxy tgzb",
			},
			// Connection pool settings (disabled for better compatibility in hosted environments)
			pool: false, // Disable pooling to avoid connection issues
			// Increased timeouts for hosted environments with network latency
			connectionTimeout: 60000, // 60 seconds - increased for hosted environments
			greetingTimeout: 30000, // 30 seconds - increased for hosted environments
			socketTimeout: 90000, // 90 seconds - increased for hosted environments
			// Additional options for better reliability
			debug: false, // Disable debug logging
			logger: false, // Disable logger
			tls: {
				// Do not fail on invalid certificates
				rejectUnauthorized: false,
			},
		} as any); // Type assertion needed due to nodemailer type definitions

		// Verify transporter connection on startup (non-blocking)
		// Disabled verification to prevent startup issues if SMTP is temporarily unavailable
		transporterInstance.verify(() => {
			// Silent verification - errors are non-critical
		});
	}
	return transporterInstance;
}

// Function to try alternate port if connection fails
function switchPortAndResetTransporter(): void {
	usePort465 = !usePort465;
	transporterInstance = null;
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
			
			// Verify email was accepted by server
			if (!info.messageId) {
				throw new Error("Email was not accepted by server - no message ID returned");
			}
			
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
				await new Promise(resolve => setTimeout(resolve, waitTime));
				
				// Reset transporter instance to force new connection
				transporterInstance = null;
				continue;
			} else {
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
	const maxRetries = 3; // Increased to 3 to allow port switching
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
			
			// Verify email was accepted by server
			if (!info.messageId) {
				throw new Error("Email was not accepted by server - no message ID returned");
			}
			
			return; // Success, exit function
		} catch (error: any) {
			lastError = error;
			const isConnectionError = 
				error?.code === "ETIMEDOUT" || 
				error?.code === "ECONNRESET" ||
				error?.code === "ECONNREFUSED" ||
				error?.message?.includes("timeout") ||
				error?.message?.includes("Connection timeout") ||
				error?.code === "EAUTH";

			if (isConnectionError && attempt < maxRetries) {
				// On first retry, try switching ports (587 <-> 465)
				if (attempt === 1) {
					switchPortAndResetTransporter();
					await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
				} else {
					const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, etc.
					await new Promise(resolve => setTimeout(resolve, waitTime));
					
					// Reset transporter instance to force new connection
					transporterInstance = null;
				}
				continue;
			} else {
				if (attempt === maxRetries) {
					// Reset transporter for next request
					transporterInstance = null;
					usePort465 = false; // Reset to default port
				}
				throw error;
			}
		}
	}

	// This should never be reached, but TypeScript needs it
	throw lastError || new Error("Failed to send email after retries");
}
