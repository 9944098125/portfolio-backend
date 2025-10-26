import Router from "express";
import { verifyOwner } from "../middleware/verify";
import {
	createSkill,
	deleteSkill,
	readSkillsByUserId,
	updateSkill,
} from "../controllers/skills";

const router = Router();

router.route("/skills/create/:userId").post(verifyOwner, createSkill);
// route to create a skills according to userId

router.route("/skills/get-skill/:userId").get(verifyOwner, readSkillsByUserId);
// route to get skills

router.route("/skills/update-skill/:skillId").post(verifyOwner, updateSkill);
// route to update skill

router.route("/skills/delete-skill/:skillId").delete(verifyOwner, deleteSkill);
// route to delete a skill

export default router;
