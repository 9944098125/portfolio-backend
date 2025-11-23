import { NextFunction, Request, Response } from "express";
import EducationalDetails from "../models/EducationalDetails";

export const createEducationalDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation for creating educational details
		const { name_of_education, start_year, passout_year, userId } = req.body;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		// Assume EducationalDetails is a mongoose model
		const newEducation = new EducationalDetails({
			name_of_education,
			start_year,
			passout_year,
			userId,
		});
		await newEducation.save();
		res.status(201).json({
			message: "Educational details created successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const getEducationalDetailsByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation for getting educational details by user ID
		const { userId } = req.params;
		const educationDetails = await EducationalDetails.find({ userId });
		res.status(200).json({
			message: "Educational details fetched successfully",
			data: educationDetails,
		});
	} catch (err) {
		next(err);
	}
};

export const getEducationalDetailsById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation for getting educational details by ID
		const { edId } = req.params;
		const educationDetail = await EducationalDetails.findOne({ _id: edId });
		if (!educationDetail) {
			return res.status(400).json({ message: "Educational detail not found" });
		}
		res.status(200).json({
			message: "Educational detail fetched successfully",
			data: educationDetail,
		});
	} catch (err) {
		next(err);
	}
};

export const updateEducationalDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation for updating educational details
		const { educationId } = req.params;
		const { name_of_education, passout_year, start_year } = req.body;

		const updatedEducation = await EducationalDetails.findByIdAndUpdate(
			educationId,
			{ name_of_education, passout_year, start_year },
			{ new: true }
		);

		if (!updatedEducation) {
			return res.status(404).json({ message: "Educational details not found" });
		}

		res.status(200).json({
			message: "Educational details updated successfully",
			data: updatedEducation,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteEducationalDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Implementation for deleting educational details
		const { educationId } = req.params;

		await EducationalDetails.findByIdAndDelete(educationId);

		res.status(200).json({
			message: "Educational details deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};
