"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactAdmin = exports.deleteContact = exports.updateContact = exports.getContactById = exports.getContactsByUserId = exports.createContact = void 0;
const Contacts_1 = __importDefault(require("../models/Contacts"));
const sendMail_1 = require("../helpers/sendMail");
const createContact = async (req, res, next) => {
    try {
        const { medium, logo, userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const newContact = new Contacts_1.default({ medium, logo, userId });
        await newContact.save();
        return res.status(201).json({
            message: "Contact created successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createContact = createContact;
const getContactsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const contacts = await Contacts_1.default.find({ userId });
        return res.status(200).json({
            message: "Contacts retrieved successfully",
            data: contacts,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getContactsByUserId = getContactsByUserId;
const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await Contacts_1.default.findOne({ _id: contactId });
        if (!contact) {
            return res.status(400).json({ message: "Contact not found" });
        }
        return res.status(200).json({
            message: "Contact retrieved successfully",
            data: contact,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getContactById = getContactById;
const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { medium, logo } = req.body;
        const updatedContact = await Contacts_1.default.findByIdAndUpdate(contactId, { medium, logo }, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        return res.status(200).json({
            message: "Contact updated successfully",
            data: updatedContact,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        await Contacts_1.default.findByIdAndDelete(contactId);
        return res.status(200).json({
            message: "Contact deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteContact = deleteContact;
const contactAdmin = async (req, res, next) => {
    try {
        const { name, email, countryCode, phone, profession } = req.body;
        // 1️⃣ Basic presence check
        if (!name || !email || !countryCode || !phone || !profession) {
            return res.status(400).json({
                message: "All fields (name, email, countryCode, phone, profession) are required.",
            });
        }
        // 2️⃣ Name validation: only alphabets & spaces
        if (!/^[A-Za-z\s]+$/.test(name)) {
            return res.status(400).json({
                message: "Name must contain only letters and spaces.",
            });
        }
        // 3️⃣ Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address.",
            });
        }
        // 4️⃣ Country code validation: must start with '+' and have 1–4 digits
        if (!/^\+\d{1,4}$/.test(countryCode)) {
            return res.status(400).json({
                message: "Invalid country code format. Example: +1 or +91",
            });
        }
        // 5️⃣ Phone number validation: only digits, length between 7–15
        if (!/^\d{7,15}$/.test(phone)) {
            return res.status(400).json({
                message: "Invalid phone number. Must be 7 to 15 digits long.",
            });
        }
        // 6️⃣ Profession validation
        if (profession.trim().length < 2) {
            return res.status(400).json({
                message: "Profession must be at least 2 characters long.",
            });
        }
        // ✅ All validations passed
        await (0, sendMail_1.sendContactDetails)(name, countryCode, phone, email, profession);
        return res.status(200).json({
            message: "Contact details sent to admin successfully.",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.contactAdmin = contactAdmin;
