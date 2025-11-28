import express from "express";
import {
	createTheme,
	readThemesByUserId,
	readThemeById,
	updateTheme,
	deleteTheme,
} from "../controllers/themes";

const router = express.Router();

router.post("/create-theme/:userId", createTheme);
// to create a theme
router.get("/get-user-theme/:userId", readThemesByUserId);
// to get a user's selected theme
router.get("/get-theme/:themeId", readThemeById);
// to get a theme by its id
router.put("/update-theme/:themeId", updateTheme);
// to update a theme by its id
router.delete("/delete-theme/:themeId", deleteTheme);
// to delete a theme by its id

export default router;
