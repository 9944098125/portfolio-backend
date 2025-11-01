"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    full_name: {
        type: String,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    about: {
        type: String,
    },
    city: {
        type: String,
    },
    designation: {
        type: String,
    },
    is_admin: {
        type: Boolean,
    },
    projects: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Projects",
        },
    ],
    skills: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Skills",
        },
    ],
    contacts: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Contacts",
        },
    ],
    educationalDetails: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "EducationalDetails",
    },
}, { timestamps: true });
const Users = mongoose_1.default.model("Users", usersSchema);
exports.default = Users;
