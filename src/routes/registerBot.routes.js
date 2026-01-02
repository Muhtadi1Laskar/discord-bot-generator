import express from "express";
import { validate } from "../middlewares/validationHandler.js";
import { registerBotConroller } from "../controllers/registerBot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/register-bot", verifyJWT, registerBotConroller);

export default router;