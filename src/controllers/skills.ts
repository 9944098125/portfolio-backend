import { NextFunction, Request, Response } from "express";
import Skills from "../models/Skills";

export const createSkill = async (
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
		const newSkill = new Skills({
			...req.body,
		});
		await newSkill.save();
		return res.status(200).json({
			message: "New Skill has been created",
			data: newSkill,
		});
	} catch (err) {
		next(err);
	}
};

export const readSkillsByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const skills = await Skills.find({ userId: userId });
		return res.status(200).json({
			message: "Skills fetched successfully",
			data: skills,
		});
	} catch (err) {
		next(err);
	}
};

export const updateSkill = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skillId } = req.params;
		await Skills.findByIdAndUpdate(
			skillId,
			{ $set: { ...req.body } },
			{ new: true }
		);
		return res.status(200).json({
			message: "Updated Skill successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const deleteSkill = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skillId } = req.params;
		await Skills.findByIdAndDelete(skillId);
		return res.status(200).json({
			message: "Deleted the Skill successfully",
		});
	} catch (err) {
		next(err);
	}
};
