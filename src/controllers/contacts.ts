import { NextFunction, Request, Response } from "express";
import Contacts from "../models/Contacts";

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
