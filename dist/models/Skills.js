"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const skillsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    level: {
        type: ["Beginner", "Intermediate", "Expert"],
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users",
    },
}, { timestamps: true });
const Skills = mongoose_1.default.model("Skills", skillsSchema);
exports.default = Skills;
