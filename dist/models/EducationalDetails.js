"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const educationalDetailsSchema = new mongoose_1.default.Schema({
    name_of_education: {
        type: String,
    },
    passout_year: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users",
    },
}, { timestamps: true });
const EducationalDetails = mongoose_1.default.model("EducationalDetails", educationalDetailsSchema);
exports.default = EducationalDetails;
