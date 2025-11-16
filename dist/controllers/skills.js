"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSkill = exports.updateSkill = exports.readSkillById = exports.readSkillsByUserId = exports.createSkill = void 0;
const Skills_1 = __importDefault(require("../models/Skills"));
const createSkill = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: "UserID missing",
                error: new Error("NO UserID"),
            });
        }
        const newSkill = new Skills_1.default({
            ...req.body,
        });
        await newSkill.save();
        return res.status(200).json({
            message: "New Skill has been created",
            data: newSkill,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createSkill = createSkill;
const readSkillsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const skills = await Skills_1.default.find({ userId: userId });
        return res.status(200).json({
            message: "Skills fetched successfully",
            data: skills,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.readSkillsByUserId = readSkillsByUserId;
const readSkillById = async (req, res, next) => {
    try {
        const { skillId } = req.params;
        const skill = await Skills_1.default.findOne({ _id: skillId });
        if (!skill) {
            return res.status(400).json({ message: "Skill Not Found !" });
        }
        return res.status(200).json({
            message: "Found the Skill successfully",
            skill: skill,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.readSkillById = readSkillById;
const updateSkill = async (req, res, next) => {
    try {
        const { skillId } = req.params;
        await Skills_1.default.findByIdAndUpdate(skillId, { $set: { ...req.body } }, { new: true });
        return res.status(200).json({
            message: "Updated Skill successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateSkill = updateSkill;
const deleteSkill = async (req, res, next) => {
    try {
        const { skillId } = req.params;
        await Skills_1.default.findByIdAndDelete(skillId);
        return res.status(200).json({
            message: "Deleted the Skill successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteSkill = deleteSkill;
