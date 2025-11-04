import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Users from "../models/Users";

interface CustomRequest extends Request {
	user?: string | JwtPayload; // Extend with custom properties
}

export const verifyAdmin = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log("req.headers", req.headers.authorization);
		const token =
			req.headers.authorization && req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(400).json({
				message: "Token not Provided",
				error: new Error("No Token"),
			});
		}
		jwt.verify(token, process.env.SECRET_TOKEN!, (err, decoded: any) => {
			if (err) {
				return res.status(500).json({
					message: "Token verification failed",
					error: err,
				});
			}
			console.log("decoded", decoded);
			if (decoded?.isAdmin) {
				next();
			} else {
				return res.status(400).json({
					message: "Unauthorized",
					error: new Error("User not allowed !"),
				});
			}
		});
	} catch (err) {
		next(err);
	}
};

export const verifyOwner = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token =
			req.headers.authorization && req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(400).json({
				message: "Token not Provided",
				error: new Error("No Token"),
			});
		}
		jwt.verify(token, process.env.SECRET_TOKEN!, async (err, decoded: any) => {
			if (err) {
				return res.status(400).json({
					message: "Error while verifying token",
					error: err,
				});
			}
			req.user = decoded;
			const user = await Users.findOne({ _id: decoded?.userId });
			if (
				(req as any)?.user?._id?.toString() === user?._id?.toString() ||
				(req as any)?.user?.is_admin
			) {
				next();
			} else {
				return res.status(400).json({
					message: "Invalid Token",
					error: new Error("Invalid Token"),
				});
			}
		});
	} catch (err) {
		next(err);
	}
};
