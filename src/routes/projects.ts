import { Router } from "express";
import { verifyOwner } from "../middleware/verify";
import {
	createProject,
	deleteProject,
	getProjectById,
	getProjectsByUserId,
	updateProject,
} from "../controllers/projects";

const router = Router();

router.route("/create-project/:userId").post(verifyOwner, createProject);
// route to create a project

router.route("/get-projects/:userId").get(verifyOwner, getProjectsByUserId);
// route to get projects according to userId

router.route("/get-project/:projectId").get(verifyOwner, getProjectById);

router.route("/update-project/:projectId").put(verifyOwner, updateProject);
// route to update a project

router.route("/delete-project/:projectId").delete(verifyOwner, deleteProject);
// route to delete a project

export default router;
