import { Router } from "express";
import { verifyOwner } from "../middleware/verify";
import {
	contactAdmin,
	createContact,
	deleteContact,
	getContactsByUserId,
	updateContact,
} from "../controllers/contacts";

const router = Router();

router.route("/create-contact/:userId").post(verifyOwner, createContact);
// route to add a contact

router.route("/get-contact/:userId").get(verifyOwner, getContactsByUserId);
// route to get all contacts by user id

router.route("/update-contact/:contactId").post(verifyOwner, updateContact);
// route to update a contact

router.route("/delete-contact/:contactId").post(verifyOwner, deleteContact);
// route to delete a contact

router.route("/contact-admin").post(contactAdmin);

export default router;
