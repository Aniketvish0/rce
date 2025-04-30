import express from 'express';
import * as submissionController from '../controllers/submission.controller';
import { authenticate, requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, requireAuth, submissionController.submitSolution);
router.get('/me', authenticate, requireAuth, submissionController.getUserSubmissions);
router.get('/problem/:problemId', submissionController.getProblemSubmissions);
router.get('/:id', authenticate, submissionController.getSubmission);
router.post('/:id/feedback', authenticate, requireAuth, submissionController.getAiFeedback);

export default router;