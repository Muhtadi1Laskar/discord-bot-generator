import express from 'express';
import { validate } from '../middlewares/validationHandler.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { botSettingsSchema } from '../schema/botSettings.schema.js';
import { botSettingController } from '../controllers/botSetting.controller.js';

const router = express.Router();

router.post("/saveSettings", verifyJWT, validate(botSettingsSchema), botSettingController);

export default router;