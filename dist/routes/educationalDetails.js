"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../middleware/verify");
const edicationalDetails_1 = require("../controllers/edicationalDetails");
const router = (0, express_1.Router)();
router
    .route("/create-educational-details/:userId")
    .post(verify_1.verifyOwner, edicationalDetails_1.createEducationalDetails);
// route to create educational details
router
    .route("/get-educational-details/:userId")
    .get(verify_1.verifyOwner, edicationalDetails_1.getEducationalDetailsByUserId);
// route to get educational details according to userId
router
    .route("/get-educational-detail/:edId")
    .get(verify_1.verifyOwner, edicationalDetails_1.getEducationalDetailsById);
// route to get educational details according to edId
router
    .route("/update-educational-details/:educationId")
    .post(verify_1.verifyOwner, edicationalDetails_1.updateEducationalDetails);
// route to update educational details
router
    .route("/delete-educational-details/:educationId")
    .delete(verify_1.verifyOwner, edicationalDetails_1.deleteEducationalDetails);
// route to delete educational details
exports.default = router;
