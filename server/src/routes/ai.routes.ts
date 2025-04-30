import express from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate, requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/feedback', authenticate, requireAuth, aiController.getCodeFeedback);

export default router;