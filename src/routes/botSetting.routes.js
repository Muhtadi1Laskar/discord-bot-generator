import express from 'express';
import { validate } from '../middlewares/validationHandler.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/saveSettings", verifyJWT, validate());

export default router;