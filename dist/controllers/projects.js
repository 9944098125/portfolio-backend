"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjectsByUserId = exports.createProject = void 0;
const Projects_1 = __importDefault(require("../models/Projects"));
const createProject = async (req, res, next) => {
    try {
        const { thumbnail, name, skills, description, liveDemo, githubLink, userId, } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const newProject = new Projects_1.default({
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
    }
    catch (err) {
        next(err);
    }
};
exports.createProject = createProject;
const getProjectsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const projects = await Projects_1.default.find({ userId });
        return res.status(200).json({
            message: "Fetched projects successfully",
            data: projects,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProjectsByUserId = getProjectsByUserId;
const getProjectById = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const project = await Projects_1.default.findOne({ _id: projectId });
        return res.status(200).json({
            message: "Fetched project successfully",
            data: project,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        await Projects_1.default.findByIdAndUpdate(projectId, { $set: { ...req.body } }, { new: true });
        return res.status(200).json({
            message: "Updated project successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        await Projects_1.default.findByIdAndDelete(projectId);
        return res.status(200).json({
            message: "Deleted project successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProject = deleteProject;
