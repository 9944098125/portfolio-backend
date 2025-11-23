"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../middleware/verify");
const contacts_1 = require("../controllers/contacts");
const router = (0, express_1.Router)();
router.route("/create-contact/:userId").post(verify_1.verifyOwner, contacts_1.createContact);
// route to add a contact
router.route("/get-contacts/:userId").get(verify_1.verifyOwner, contacts_1.getContactsByUserId);
// route to get all contacts by user id
router.route("/get-contact/:contactId").get(verify_1.verifyOwner, contacts_1.getContactById);
// route to get a contact by contact id
router.route("/update-contact/:contactId").post(verify_1.verifyOwner, contacts_1.updateContact);
// route to update a contact
router.route("/delete-contact/:contactId").post(verify_1.verifyOwner, contacts_1.deleteContact);
// route to delete a contact
router.route("/contact-admin").post(contacts_1.contactAdmin);
exports.default = router;
