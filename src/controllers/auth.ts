import { NextFunction, Request, Response } from "express";
import Users from "../models/Users";
import bcryptJs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../helpers/sendMail";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, phone, password } = req.body;
		const existingUser = await Users.findOne({
			$or: [{ email: email }, { phone: phone }],
		});
		if (existingUser) {
			return res.status(404).json({
				message: "User already exists with this Email/Phone",
				error: new Error("User already exists !"),
			});
		}
		const saltRounds = bcryptJs.genSaltSync(12);
		const hashedPassword = bcryptJs.hashSync(saltRounds);
		const newUser = new Users({
			email,
			phone,
			password: hashedPassword,
		});
		await newUser.save();
		sendRegistrationEmail(email);
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
	try {
		const { emailOrPhone, password } = req.body;
		if (!emailOrPhone || !password) {
			return res.status(404).json({
				message: "Email/Phone and Password are required !",
				error: new Error("Missing Required Fields !"),
			});
		}
		const user = await Users.findOne({
			$or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
		});
		if (!user) {
			return res.status(400).json({
				message: "User not found",
				error: new Error("No User with this email or phone !"),
			});
		}
		const passwordMatch = bcryptJs.compare(password, user.password as string);
		if (!passwordMatch) {
			return res.status(405).json({
				message: "Invalid Password !",
				error: new Error("Wrong Password"),
			});
		}
		const userWithoutPassword = await Users.findOne({
			email: user?.email,
		}).select("-password");
		const token = jwt.sign(
			{ userId: user?._id, isAdmin: user?.is_admin },
			process.env.SECRET_TOKEN!
		);
		return res.status(200).json({
			message: "Login Success !",
			user: userWithoutPassword,
			token: token,
		});
	} catch (err) {
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
		const user = await Users.findOne({ _id: userId }).select("-password");
		return res.status(200).json({
			message: "Fetched the user successfully",
			data: user,
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
