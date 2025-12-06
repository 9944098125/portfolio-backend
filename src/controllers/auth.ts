import { NextFunction, Request, Response } from "express";
import Users from "../models/Users";
import bcryptJs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../helpers/sendMail";
import Skills from "../models/Skills";
import Projects from "../models/Projects";
import Contacts from "../models/Contacts";
import EducationalDetails from "../models/EducationalDetails";
import Themes from "../models/Themes";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const existingUser = await Users.findOne({
			$or: [{ email: req.body.email }, { phone: req.body.phone }],
		});
		if (existingUser) {
			return res.status(404).json({
				message: "User already exists with this Email/Phone",
				error: new Error("User already exists !"),
			});
		}
		const salt = bcryptJs.genSaltSync(12);
		const hashedPassword = bcryptJs.hashSync(req.body.password, salt);
		const newUser = new Users({
			...req.body,
			password: hashedPassword,
		});
		await newUser.save();
		sendRegistrationEmail(req.body.email);
		return res.status(201).json({
			message: "User Registered Successfully !",
		});
	} catch (err) {
		next(err);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { emailOrPhone, password } = req.body;
	// console.log(req.body);
	try {
		// check if the req has email or not
		const isEmail = /^\S+@\S+\.\S+$/.test(emailOrPhone);

		const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };
		// console.log(OrPhone, password);
		const existingUser = await Users.findOne(query);
		if (!existingUser) {
			return res
				.status(400)
				.json({ message: "No User with this email or Phone...❌" });
		}
		const passwordHash =
			typeof existingUser.password === "string" ? existingUser.password : "";
		if (!passwordHash) {
			return res
				.status(400)
				.json({ message: "User does not have a password set" });
		}
		const passwordMatches = await bcryptJs.compare(password, passwordHash);
		if (!passwordMatches) {
			return res.status(400).json({ message: "Wrong Password !" });
		}
		const userWithoutPassword = await Users.findOne(query).select("-password");
		const token = jwt.sign(
			{
				userId: existingUser._id,
				isAdmin: existingUser.is_admin,
			},
			process.env.SECRET_TOKEN!
		);
		res.status(200).json({
			message: "Login Success ✅",
			token: token,
			user: userWithoutPassword,
		});
	} catch (err: any) {
		next(err);
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		await Users.findByIdAndUpdate(
			userId,
			{ $set: { ...req.body } },
			{ new: true }
		);
		return res.status(200).json({
			message: "Updated the user successfully",
		});
	} catch (err) {
		next(err);
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await Users.find();
		return res.status(200).json({
			message: "Fetched all the users successfully",
			data: users,
		});
	} catch (err) {
		next(err);
	}
};

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const user = await Users.findOne({ _id: userId })
			.select("-password")
			.lean();
		const skills = await Skills.find({ userId: userId }).lean();
		const projects = await Projects.find({ userId: userId }).lean();
		const contacts = await Contacts.find({ userId: userId }).lean();
		const educationalDetails = await EducationalDetails.find({
			userId: userId,
		}).lean();
		const selectedTheme = await Themes.findOne({ userId: userId }).lean();
		return res.status(200).json({
			message: "Fetched the user successfully",
			data: {
				...user,
				skills: skills,
				projects: projects,
				contacts: contacts,
				educationalDetails: educationalDetails,
				selectedTheme: selectedTheme,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const { oldPassword, newPassword } = req.body;
		const user = await Users.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const passwordHash = typeof user.password === "string" ? user.password : "";
		const isMatch = await bcryptJs.compare(oldPassword, passwordHash);
		if (!isMatch) {
			return res.status(400).json({ message: "Old password is incorrect" });
		}
		const salt = bcryptJs.genSaltSync(12);
		const hashedNewPassword = bcryptJs.hashSync(newPassword, salt);
		user.password = hashedNewPassword;
		await user.save();
		return res.status(200).json({ message: "Password changed successfully" });
	} catch (err) {
		next(err);
	}
};

export const changeMode = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const { isDarkMode } = req.body; // 'light' or 'dark'
		await Users.findByIdAndUpdate(
			userId,
			{ $set: { isDarkMode: isDarkMode } },
			{ new: true }
		);
		return res.status(200).json({
			message: `Mode changed to ${isDarkMode ? "Dark" : "Light"} successfully`,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		await Users.findByIdAndDelete(userId);
		return res.status(200).json({
			message: "User has been deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};
