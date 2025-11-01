"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../middleware/verify");
const projects_1 = require("../controllers/projects");
const router = (0, express_1.Router)();
router.route("/create-project/:userId").post(verify_1.verifyOwner, projects_1.createProject);
// route to create a project
router.route("/get-projects/:userId").get(verify_1.verifyOwner, projects_1.getProjectsByUserId);
// route to get projects according to userId
router.route("/update-project/:projectId").put(verify_1.verifyOwner, projects_1.updateProject);
// route to update a project
router.route("/delete-project/:projectId").delete(verify_1.verifyOwner, projects_1.deleteProject);
// route to delete a project
exports.default = router;
