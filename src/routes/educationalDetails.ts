import { Router } from "express";
import { verifyOwner } from "../middleware/verify";
import {
	createEducationalDetails,
	deleteEducationalDetails,
	getEducationalDetailsByUserId,
	updateEducationalDetails,
} from "../controllers/edicationalDetails";

const router = Router();

router
	.route("/create-educational-details/:userId")
	.post(verifyOwner, createEducationalDetails);
// route to create educational details

router
	.route("/get-educational-details/:userId")
	.get(verifyOwner, getEducationalDetailsByUserId);
// route to get educational details according to userId

router
	.route("/update-educational-details/:educationId")
	.put(verifyOwner, updateEducationalDetails);
// route to update educational details

router
	.route("/delete-educational-details/:educationId")
	.delete(verifyOwner, deleteEducationalDetails);
// route to delete educational details

export default router;
