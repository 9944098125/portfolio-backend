"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTheme = exports.updateTheme = exports.readThemeById = exports.readThemesByUserId = exports.createTheme = void 0;
const Themes_1 = __importDefault(require("../models/Themes"));
// Create Theme for a user
const createTheme = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: "UserID missing",
                error: new Error("NO UserID"),
            });
        }
        const newTheme = new Themes_1.default({
            ...req.body,
            userId, // ensure theme is linked to the user
        });
        await newTheme.save();
        return res.status(200).json({
            message: "New Theme has been created",
            data: newTheme,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createTheme = createTheme;
// Get all themes for a user
const readThemesByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: "UserID missing",
                error: new Error("NO UserID"),
            });
        }
        const themes = await Themes_1.default.find({ userId: userId });
        return res.status(200).json({
            message: "Themes fetched successfully",
            data: themes,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.readThemesByUserId = readThemesByUserId;
// Get single theme by themeId
const readThemeById = async (req, res, next) => {
    try {
        const { themeId } = req.params;
        const theme = await Themes_1.default.findOne({ _id: themeId });
        if (!theme) {
            return res.status(400).json({ message: "Theme Not Found !" });
        }
        return res.status(200).json({
            message: "Found the Theme successfully",
            data: theme,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.readThemeById = readThemeById;
// Update theme by themeId
const updateTheme = async (req, res, next) => {
    try {
        const { themeId } = req.params;
        await Themes_1.default.findByIdAndUpdate(themeId, { $set: { ...req.body } }, { new: true });
        return res.status(200).json({
            message: "Updated Theme successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateTheme = updateTheme;
// Delete theme by themeId
const deleteTheme = async (req, res, next) => {
    try {
        const { themeId } = req.params;
        await Themes_1.default.findByIdAndDelete(themeId);
        return res.status(200).json({
            message: "Deleted the Theme successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTheme = deleteTheme;
