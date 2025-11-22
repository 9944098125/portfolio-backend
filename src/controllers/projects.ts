import { NextFunction, Request, Response } from "express";
import Projects from "../models/Projects";

export const createProject = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			thumbnail,
			name,
			skills,
			description,
			liveDemo,
			githubLink,
			userId,
		} = req.body;
		if (!userId) {
			return res.status(400).json({ message: "userId is required" });
		}
		const newProject = new Projects({
			thumbnail,
			name,
			skills,
			description,
			liveDemo,
			githubLink,
			userId,
		});
		await newProject.save();
		return res.status(201).json({
			message: "Created project successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const getProjectsByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const projects = await Projects.find({ userId });
		return res.status(200).json({
			message: "Fetched projects successfully",
			data: projects,
		});
	} catch (err) {
		next(err);
	}
};

export const getProjectById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { projectId } = req.params;
		const project = await Projects.findOne({ _id: projectId });
		return res.status(200).json({
			message: "Fetched project successfully",
			data: project,
		});
	} catch (err) {
		next(err);
	}
};

export const updateProject = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { projectId } = req.params;
		await Projects.findByIdAndUpdate(
			projectId,
			{ $set: { ...req.body } },
			{ new: true }
		);
		return res.status(200).json({
			message: "Updated project successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const deleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { projectId } = req.params;
		await Projects.findByIdAndDelete(projectId);
		return res.status(200).json({
			message: "Deleted project successfully",
		});
	} catch (err) {
		next(err);
	}
};
