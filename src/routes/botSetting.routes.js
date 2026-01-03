import express from 'express';
import { validate } from '../middlewares/validationHandler.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { botRulesSchema } from '../schema/botSettings.schema.js';
import { botSettingController } from '../controllers/botSetting.controller.js';

const router = express.Router();

router.post("/saveSettings", verifyJWT, validate(botRulesSchema), botSettingController);

export default router;