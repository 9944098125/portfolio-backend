"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegistrationEmail = sendRegistrationEmail;
exports.sendContactDetails = sendContactDetails;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Singleton transporter - created once and reused for all email requests
// This significantly improves performance by reusing connections
let transporterInstance = null;
let usePort465 = false; // Track which port we're using
function getTransporter(reset = false) {
    if (!transporterInstance || reset) {
        // Use explicit Gmail SMTP configuration for better reliability in hosted environments
        // Try port 587 (TLS) first, fallback to 465 (SSL) if needed
        const port = usePort465 ? 465 : 587;
        const secure = usePort465;
        console.log(`Creating email transporter with port ${port} (secure: ${secure})...`);
        transporterInstance = nodemailer_1.default.createTransport({
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
            connectionTimeout: 30000, // 30 seconds - increased for hosted environments
            greetingTimeout: 30000, // 30 seconds - increased for hosted environments
            socketTimeout: 60000, // 60 seconds - increased for hosted environments
            // Additional options for better reliability
            debug: true, // Enable debug for troubleshooting
            logger: true, // Enable logging
        }); // Type assertion needed due to nodemailer type definitions
        // Verify transporter connection on startup (non-blocking)
        // Disabled verification to prevent startup issues if SMTP is temporarily unavailable
        transporterInstance.verify((error, success) => {
            if (error) {
                console.warn(`Email transporter verification failed on port ${port} (non-critical):`, error.message);
                console.warn("Email will still attempt to send on demand.");
            }
            else {
                console.log(`✅ Email transporter ready on port ${port}`);
            }
        });
    }
    return transporterInstance;
}
// Function to try alternate port if connection fails
function switchPortAndResetTransporter() {
    usePort465 = !usePort465;
    transporterInstance = null;
    console.log(`Switching to port ${usePort465 ? 465 : 587} and resetting transporter...`);
}
async function sendRegistrationEmail(email) {
    const maxRetries = 2;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const transporter = getTransporter();
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
            // Send the email with timeout
            const sendPromise = transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Email send timeout after 45 seconds")), 45000);
            });
            const info = await Promise.race([sendPromise, timeoutPromise]);
            // Verify email was accepted by server
            if (!info.messageId) {
                throw new Error("Email was not accepted by server - no message ID returned");
            }
            console.log(`✅ Registration email sent successfully (attempt ${attempt})`);
            console.log(`   Message ID: ${info.messageId}`);
            console.log(`   To: ${mailOptions.to}`);
            console.log(`   Response: ${info.response || 'Accepted'}`);
            return; // Success, exit function
        }
        catch (error) {
            lastError = error;
            const isTimeoutError = error?.code === "ETIMEDOUT" ||
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
            }
            else {
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
async function sendContactDetails(name, countryCode, phone, email, profession) {
    const maxRetries = 3; // Increased to 3 to allow port switching
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const transporter = getTransporter();
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
            // Send the email with timeout
            const sendPromise = transporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Email send timeout after 45 seconds")), 45000);
            });
            const info = await Promise.race([sendPromise, timeoutPromise]);
            // Verify email was accepted by server
            if (!info.messageId) {
                throw new Error("Email was not accepted by server - no message ID returned");
            }
            console.log(`✅ Contact email sent successfully (attempt ${attempt})`);
            console.log(`   Message ID: ${info.messageId}`);
            console.log(`   To: ${mailOptions.to}`);
            console.log(`   Response: ${info.response || 'Accepted'}`);
            return; // Success, exit function
        }
        catch (error) {
            lastError = error;
            const isConnectionError = error?.code === "ETIMEDOUT" ||
                error?.code === "ECONNRESET" ||
                error?.code === "ECONNREFUSED" ||
                error?.message?.includes("timeout") ||
                error?.message?.includes("Connection timeout") ||
                error?.code === "EAUTH";
            if (isConnectionError && attempt < maxRetries) {
                // On first retry, try switching ports (587 <-> 465)
                if (attempt === 1) {
                    console.warn(`Email send attempt ${attempt} failed. Trying alternate port...`, error.message);
                    switchPortAndResetTransporter();
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
                }
                else {
                    const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, etc.
                    console.warn(`Email send attempt ${attempt} failed. Retrying in ${waitTime}ms...`, error.message);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    // Reset transporter instance to force new connection
                    transporterInstance = null;
                }
                continue;
            }
            else {
                console.error(`Error sending contact email (attempt ${attempt}):`, error);
                console.error(`Error details:`, {
                    code: error?.code,
                    message: error?.message,
                    command: error?.command,
                });
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
