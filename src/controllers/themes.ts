import { NextFunction, Request, Response } from "express";
import Themes from "../models/Themes";

// Create Theme for a user
export const createTheme = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(404).json({
				message: "UserID missing",
				error: new Error("NO UserID"),
			});
		}

		const newTheme = new Themes({
			...req.body,
			userId, // ensure theme is linked to the user
		});

		await newTheme.save();

		return res.status(200).json({
			message: "New Theme has been created",
			data: newTheme,
		});
	} catch (err) {
		next(err);
	}
};

// Get all themes for a user
export const readThemesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return res.status(404).json({
				message: "UserID missing",
				error: new Error("NO UserID"),
			});
		}

		const themes = await Themes.find({ userId: userId });

		return res.status(200).json({
			message: "Themes fetched successfully",
			data: themes,
		});
	} catch (err) {
		next(err);
	}
};

// Get single theme by themeId
export const readThemeById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { themeId } = req.params;

		const theme = await Themes.findOne({ _id: themeId });

		if (!theme) {
			return res.status(400).json({ message: "Theme Not Found !" });
		}

		return res.status(200).json({
			message: "Found the Theme successfully",
			data: theme,
		});
	} catch (err) {
		next(err);
	}
};

// Update theme by themeId
export const updateTheme = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { themeId } = req.params;

		await Themes.findByIdAndUpdate(
			themeId,
			{ $set: { ...req.body } },
			{ new: true }
		);

		return res.status(200).json({
			message: "Updated Theme successfully",
		});
	} catch (err) {
		next(err);
	}
};

// Delete theme by themeId
export const deleteTheme = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { themeId } = req.params;

		await Themes.findByIdAndDelete(themeId);

		return res.status(200).json({
			message: "Deleted the Theme successfully",
		});
	} catch (err) {
		next(err);
	}
};
