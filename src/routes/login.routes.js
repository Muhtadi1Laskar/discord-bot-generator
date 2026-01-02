import express from "express";
import { validate } from "../middlewares/validationHandler.js";
import loginController from "../controllers/login.controller.js";
import { loginSchema } from "../schema/login.schema.js";

const router = express.Router();

router.post("/", validate(loginSchema), loginController);

export default router;