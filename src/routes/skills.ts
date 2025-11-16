import Router from "express";
import { verifyOwner } from "../middleware/verify";
import {
	createSkill,
	deleteSkill,
	readSkillById,
	readSkillsByUserId,
	updateSkill,
} from "../controllers/skills";

const router = Router();

router.route("/create-skill/:userId").post(verifyOwner, createSkill);
// route to create a skills according to userId

router.route("/get-skills/:userId").get(verifyOwner, readSkillsByUserId);
// route to get skills

router.route("/get-skill/:skillId").get(verifyOwner, readSkillById);

router.route("/update-skill/:skillId").post(verifyOwner, updateSkill);
// route to update skill

router.route("/delete-skill/:skillId").delete(verifyOwner, deleteSkill);
// route to delete a skill

export default router;
