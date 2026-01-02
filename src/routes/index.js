import express from "express";
import signupRoutes from "./signup.routes.js";
import loginRoutes from "./login.routes.js";
import registerBotRoutes from "./registerBot.routes.js";

const router = express.Router();

router.use("/signup", signupRoutes);
router.use("/login", loginRoutes);
router.use("/bot", registerBotRoutes);

export default router;