"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOwner = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const verifyAdmin = async (req, res, next) => {
    try {
        console.log("req.headers", req.headers.authorization);
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Token not Provided",
                error: new Error("No Token"),
            });
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    message: "Token verification failed",
                    error: err,
                });
            }
            console.log("decoded", decoded);
            if (decoded?.isAdmin) {
                next();
            }
            else {
                return res.status(400).json({
                    message: "Unauthorized",
                    error: new Error("User not allowed !"),
                });
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyOwner = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Token not Provided",
                error: new Error("No Token"),
            });
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    message: "Error while verifying token",
                    error: err,
                });
            }
            req.user = decoded;
            const user = await Users_1.default.findOne({ _id: decoded?.userId });
            if (req?.user?.userId?.toString() === user?._id?.toString() ||
                req?.user?.isAdmin) {
                next();
            }
            else {
                return res.status(400).json({
                    message: "Invalid Token",
                    error: new Error("Invalid Token"),
                });
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.verifyOwner = verifyOwner;
