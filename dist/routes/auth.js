"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const verify_1 = require("../middleware/verify");
const router = (0, express_1.Router)();
router.route("/login").post(auth_1.login);
// route to login
router.route("/register").post(verify_1.verifyAdmin, auth_1.register);
// route to register
router.route("/update-user/:userId").post(verify_1.verifyOwner, auth_1.updateUser);
// route to update self portfolio fields
router.route("/get-users").get(auth_1.getAllUsers);
// to get all the users that is shown in the landing page
router.route("/get-user/:userId").get(auth_1.getUserById);
// to get each user detailed portfolio details
router.route("/delete-user/:userId").delete(verify_1.verifyAdmin, auth_1.deleteUser);
// to delete the self portfolio
exports.default = router;
