import express from "express";
import signupRoutes from "./signup.routes.js";
import loginRoutes from "./login.routes.js";

const router = express.Router();

router.use("/signup", signupRoutes);
router.use("/login", loginRoutes);

export default router;