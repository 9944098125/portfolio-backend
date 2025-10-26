import { Router } from "express";
import { login, register } from "../controllers/auth";

const router = Router();

router.route("/auth/login").post(login);
// route to login

router.route("/auth/register").post(register);
// route to register

export default router;
