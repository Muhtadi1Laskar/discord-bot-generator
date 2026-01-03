import express from "express";
import { validate } from "../middlewares/validationHandler.js";
import { discordCallbackController, registerBotConroller } from "../controllers/registerBot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/registerBot", verifyJWT, registerBotConroller);
router.get("/callback", discordCallbackController);

export default router;