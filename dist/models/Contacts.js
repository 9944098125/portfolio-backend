"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactsSchema = new mongoose_1.default.Schema({
    medium: {
        type: String,
    },
    logo: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users",
    },
}, { timestamps: true });
const Contacts = mongoose_1.default.model("Contacts", contactsSchema);
exports.default = Contacts;
