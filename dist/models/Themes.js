"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const themesSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    primaryColor: {
        type: String,
    },
    secondaryColor: {
        type: String,
    },
    boldBg: {
        type: String,
    },
    background: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users",
    },
}, { timestamps: true });
const Themes = mongoose_1.default.model("Themes", themesSchema);
exports.default = Themes;
