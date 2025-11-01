"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const skills_1 = require("../controllers/skills");
const router = (0, express_1.default)();
router.route("/create-skill/:userId").post(verify_1.verifyOwner, skills_1.createSkill);
// route to create a skills according to userId
router.route("/get-skill/:userId").get(verify_1.verifyOwner, skills_1.readSkillsByUserId);
// route to get skills
router.route("/update-skill/:skillId").post(verify_1.verifyOwner, skills_1.updateSkill);
// route to update skill
router.route("/delete-skill/:skillId").delete(verify_1.verifyOwner, skills_1.deleteSkill);
// route to delete a skill
exports.default = router;
