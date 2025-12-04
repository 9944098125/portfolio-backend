import { NextFunction, Request, Response } from "express";
import Contacts from "../models/Contacts";
import { sendContactDetails } from "../helpers/sendMail";

export const createContact = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { medium, logo, userId } = req.body;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		const newContact = new Contacts({ medium, logo, userId });
		await newContact.save();
		return res.status(201).json({
			message: "Contact created successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const getContactsByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const contacts = await Contacts.find({ userId });
		return res.status(200).json({
			message: "Contacts retrieved successfully",
			data: contacts,
		});
	} catch (err) {
		next(err);
	}
};

export const getContactById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { contactId } = req.params;
		const contact = await Contacts.findOne({ _id: contactId });
		if (!contact) {
			return res.status(400).json({ message: "Contact not found" });
		}
		return res.status(200).json({
			message: "Contact retrieved successfully",
			data: contact,
		});
	} catch (err) {
		next(err);
	}
};

export const updateContact = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { contactId } = req.params;
		const { medium, logo } = req.body;

		const updatedContact = await Contacts.findByIdAndUpdate(
			contactId,
			{ medium, logo },
			{ new: true }
		);

		if (!updatedContact) {
			return res.status(404).json({ message: "Contact not found" });
		}

		return res.status(200).json({
			message: "Contact updated successfully",
			data: updatedContact,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteContact = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { contactId } = req.params;

		await Contacts.findByIdAndDelete(contactId);

		return res.status(200).json({
			message: "Contact deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const contactAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, countryCode, phone, profession } = req.body;

		// 1️⃣ Basic presence check
		if (!name || !email || !countryCode || !phone || !profession) {
			return res.status(400).json({
				message:
					"All fields (name, email, countryCode, phone, profession) are required.",
			});
		}

		// 2️⃣ Name validation: only alphabets & spaces
		if (!/^[A-Za-z\s]+$/.test(name)) {
			return res.status(400).json({
				message: "Name must contain only letters and spaces.",
			});
		}

		// 3️⃣ Email validation
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return res.status(400).json({
				message: "Please provide a valid email address.",
			});
		}

		// 4️⃣ Country code validation: must start with '+' and have 1–4 digits
		if (!/^\+\d{1,4}$/.test(countryCode)) {
			return res.status(400).json({
				message: "Invalid country code format. Example: +1 or +91",
			});
		}

		// 5️⃣ Phone number validation: only digits, length between 7–15
		if (!/^\d{7,15}$/.test(phone)) {
			return res.status(400).json({
				message: "Invalid phone number. Must be 7 to 15 digits long.",
			});
		}

		// 6️⃣ Profession validation
		if (profession.trim().length < 2) {
			return res.status(400).json({
				message: "Profession must be at least 2 characters long.",
			});
		}

		// ✅ All validations passed
		// Send email and wait for confirmation before responding
		// This ensures we only return success if email is actually sent
		await sendContactDetails(name, countryCode, phone, email, profession);

		// Only return success if email was sent successfully
		return res.status(200).json({
			message: "Contact details sent to admin successfully.",
		});
	} catch (err: any) {
		console.error("Error in contactAdmin:", err);
		
		// Handle specific email errors with user-friendly messages
		if (err?.code === "EAUTH") {
			return res.status(500).json({
				message: "Email authentication failed. Please check email configuration.",
				success: false,
			});
		}
		
		if (err?.code === "ECONNECTION" || err?.code === "ETIMEDOUT" || err?.message?.includes("timeout")) {
			return res.status(500).json({
				message: "Failed to connect to email server. Please try again later.",
				success: false,
			});
		}
		
		if (err?.message?.includes("Email send timeout")) {
			return res.status(500).json({
				message: "Email sending timed out. Please try again later.",
				success: false,
			});
		}
		
		// Generic error response
		return res.status(500).json({
			message: err?.message || "Failed to send contact details. Please try again later.",
			success: false,
		});
	}
};
