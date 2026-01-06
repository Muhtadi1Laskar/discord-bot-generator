import express from "express";
import moderateMessageSchema from "../schema/moderator.schema.js";
import { moderatorController } from "../controllers/moderatorController.js";
import { validate } from "../middlewares/validationHandler.js";

const router = express.Router();

router.post("/moderator", validate(moderateMessageSchema), moderatorController);

export default router;

