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
    const { name, email, countryCode, phone, profession, message } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------
    if (!name || !email || !countryCode || !phone || !profession) {
      const missingFields = [];

      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!countryCode) missingFields.push("countryCode");
      if (!phone) missingFields.push("phone");
      if (!profession) missingFields.push("profession");

      const error: any = new Error(
        `Missing required fields: ${missingFields.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    // -----------------------------
    // Send email
    // -----------------------------
    await sendContactDetails(name, countryCode, phone, email, profession, message);

    // -----------------------------
    // Success response
    // -----------------------------
    return res.status(200).json({
      success: true,
      message: "Contact details sent successfully.",
    });
  } catch (err) {
    next(err); // forward to error middleware
  }
};

