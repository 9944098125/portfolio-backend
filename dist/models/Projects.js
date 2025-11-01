"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectsSchema = new mongoose_1.default.Schema({
    thumbnail: {
        type: String,
    },
    name: {
        type: String,
    },
    skills: {
        type: [String],
    },
    description: {
        type: String,
    },
    liveDemo: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users",
    },
}, { timestamps: true });
const Projects = mongoose_1.default.model("Projects", projectsSchema);
exports.default = Projects;
