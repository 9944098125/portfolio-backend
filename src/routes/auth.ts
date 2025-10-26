import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getUserById,
	login,
	register,
	updateUser,
} from "../controllers/auth";
import { verifyAdmin, verifyOwner } from "../middleware/verify";

const router = Router();

router.route("/auth/login").post(login);
// route to login

router.route("/auth/register").post(verifyAdmin, register);
// route to register

router.route("/auth/update-user/:userId").post(verifyOwner, updateUser);
// route to update self portfolio fields

router.route("/auth/get-users").get(getAllUsers);
// to get all the users that is shown in the landing page

router.route("/auth/get-user/:userId").get(verifyOwner, getUserById);
// to get each user detailed portfolio details

router.route("/auth/delete-user/:userId").delete(verifyOwner, deleteUser);
// to delete the self portfolio

export default router;
