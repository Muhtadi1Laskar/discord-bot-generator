import express from 'express';
import { validate } from '../middlewares/validationHandler.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { botSettingSchema } from '../schema/botSettings.schema.js';

const router = express.Router();

router.post("/saveSettings", verifyJWT, validate(botSettingSchema));

export default router;