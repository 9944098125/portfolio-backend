"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducationalDetails = exports.updateEducationalDetails = exports.getEducationalDetailsById = exports.getEducationalDetailsByUserId = exports.createEducationalDetails = void 0;
const EducationalDetails_1 = __importDefault(require("../models/EducationalDetails"));
const createEducationalDetails = async (req, res, next) => {
    try {
        // Implementation for creating educational details
        const { name_of_education, start_year, passout_year, present, is_education, userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Assume EducationalDetails is a mongoose model
        const newEducation = new EducationalDetails_1.default({
            name_of_education,
            start_year,
            passout_year,
            present: present || false,
            is_education: is_education !== undefined ? is_education : true,
            userId,
        });
        await newEducation.save();
        res.status(201).json({
            message: "Educational details created successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createEducationalDetails = createEducationalDetails;
const getEducationalDetailsByUserId = async (req, res, next) => {
    try {
        // Implementation for getting educational details by user ID
        const { userId } = req.params;
        const educationDetails = await EducationalDetails_1.default.find({ userId });
        res.status(200).json({
            message: "Educational details fetched successfully",
            data: educationDetails,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getEducationalDetailsByUserId = getEducationalDetailsByUserId;
const getEducationalDetailsById = async (req, res, next) => {
    try {
        // Implementation for getting educational details by ID
        const { edId } = req.params;
        const educationDetail = await EducationalDetails_1.default.findOne({ _id: edId });
        if (!educationDetail) {
            return res.status(400).json({ message: "Educational detail not found" });
        }
        res.status(200).json({
            message: "Educational detail fetched successfully",
            data: educationDetail,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getEducationalDetailsById = getEducationalDetailsById;
const updateEducationalDetails = async (req, res, next) => {
    try {
        // Implementation for updating educational details
        const { educationId } = req.params;
        const { name_of_education, passout_year, start_year, present, is_education } = req.body;
        const updatedEducation = await EducationalDetails_1.default.findByIdAndUpdate(educationId, {
            name_of_education,
            passout_year,
            start_year,
            present: present || false,
            is_education: is_education !== undefined ? is_education : true
        }, { new: true });
        if (!updatedEducation) {
            return res.status(404).json({ message: "Educational details not found" });
        }
        res.status(200).json({
            message: "Educational details updated successfully",
            data: updatedEducation,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateEducationalDetails = updateEducationalDetails;
const deleteEducationalDetails = async (req, res, next) => {
    try {
        // Implementation for deleting educational details
        const { educationId } = req.params;
        await EducationalDetails_1.default.findByIdAndDelete(educationId);
        res.status(200).json({
            message: "Educational details deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteEducationalDetails = deleteEducationalDetails;
