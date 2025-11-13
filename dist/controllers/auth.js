"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserById = exports.getAllUsers = exports.updateUser = exports.login = exports.register = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = require("../helpers/sendMail");
const Skills_1 = __importDefault(require("../models/Skills"));
const Projects_1 = __importDefault(require("../models/Projects"));
const Contacts_1 = __importDefault(require("../models/Contacts"));
const EducationalDetails_1 = __importDefault(require("../models/EducationalDetails"));
const register = async (req, res, next) => {
    try {
        const existingUser = await Users_1.default.findOne({
            $or: [{ email: req.body.email }, { phone: req.body.phone }],
        });
        if (existingUser) {
            return res.status(404).json({
                message: "User already exists with this Email/Phone",
                error: new Error("User already exists !"),
            });
        }
        const salt = bcryptjs_1.default.genSaltSync(12);
        const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
        const newUser = new Users_1.default({
            ...req.body,
            password: hashedPassword,
        });
        await newUser.save();
        (0, sendMail_1.sendRegistrationEmail)(req.body.email);
        return res.status(201).json({
            message: "User Registered Successfully !",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const { emailOrPhone, password } = req.body;
    // console.log(req.body);
    try {
        // check if the req has email or not
        const isEmail = /^\S+@\S+\.\S+$/.test(emailOrPhone);
        const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };
        // console.log(OrPhone, password);
        const existingUser = await Users_1.default.findOne(query);
        if (!existingUser) {
            return res
                .status(400)
                .json({ message: "No User with this email or Phone...❌" });
        }
        const passwordHash = typeof existingUser.password === "string" ? existingUser.password : "";
        if (!passwordHash) {
            return res
                .status(400)
                .json({ message: "User does not have a password set" });
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, passwordHash);
        if (!passwordMatches) {
            return res.status(400).json({ message: "Wrong Password !" });
        }
        const userWithoutPassword = await Users_1.default.findOne(query).select("-password");
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
            isAdmin: existingUser.is_admin,
        }, process.env.SECRET_TOKEN);
        res.status(200).json({
            message: "Login Success ✅",
            token: token,
            user: userWithoutPassword,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await Users_1.default.findByIdAndUpdate(userId, { $set: { ...req.body } }, { new: true });
        return res.status(200).json({
            message: "Updated the user successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUser = updateUser;
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users_1.default.find();
        return res.status(200).json({
            message: "Fetched all the users successfully",
            data: users,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await Users_1.default.findOne({ _id: userId })
            .select("-password")
            .lean();
        const skills = await Skills_1.default.find({ userId: userId }).lean();
        const projects = await Projects_1.default.find({ userId: userId }).lean();
        const contacts = await Contacts_1.default.find({ userId: userId }).lean();
        const educationalDetails = await EducationalDetails_1.default.find({
            userId: userId,
        }).lean();
        return res.status(200).json({
            message: "Fetched the user successfully",
            data: {
                ...user,
                skills: skills,
                projects: projects,
                contacts: contacts,
                educationalDetails: educationalDetails,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserById = getUserById;
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await Users_1.default.findByIdAndDelete(userId);
        return res.status(200).json({
            message: "User has been deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
