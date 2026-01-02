import express from "express";
import { validate } from "../middlewares/validationHandler.js";
import { signupSchema } from "../schema/signup.schema.js";
import {activateController, signupController} from "../controllers/signup.controller.js";

const router = express.Router();

router.post("/", validate(signupSchema), signupController);
router.post("/activate/:token", activateController);

export default router;