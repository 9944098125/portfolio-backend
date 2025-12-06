import { Router } from "express";
import {
	changePassword,
	deleteUser,
	getAllUsers,
	getUserById,
	login,
	register,
	updateUser,
} from "../controllers/auth";
import { verifyAdmin, verifyOwner } from "../middleware/verify";

const router = Router();

router.route("/login").post(login);
// route to login

router.route("/register").post(verifyAdmin, register);
// route to register

router.route("/update-user/:userId").post(verifyOwner, updateUser);
// route to update self portfolio fields

router.route("/get-users").get(getAllUsers);
// to get all the users that is shown in the landing page

router.route("/get-user/:userId").get(getUserById);
// to get each user detailed portfolio details

router.route("/change-password/:userId").post(verifyOwner, changePassword);
// to change the password of self portfolio builder account

router.route("/change-theme/:userId").post(verifyOwner, updateUser);

router.route("/delete-user/:userId").delete(verifyAdmin, deleteUser);
// to delete the self portfolio

export default router;
