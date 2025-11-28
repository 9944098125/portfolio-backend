"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const themes_1 = require("../controllers/themes");
const router = express_1.default.Router();
router.post("/create-theme/:userId", themes_1.createTheme);
// to create a theme
router.get("/get-user-theme/:userId", themes_1.readThemesByUserId);
// to get a user's selected theme
router.get("/get-theme/:themeId", themes_1.readThemeById);
// to get a theme by its id
router.put("/update-theme/:themeId", themes_1.updateTheme);
// to update a theme by its id
router.delete("/delete-theme/:themeId", themes_1.deleteTheme);
// to delete a theme by its id
exports.default = router;
