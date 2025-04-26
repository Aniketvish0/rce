import express from 'express';
import * as problemController from '../controllers/problem.controller';
import { authenticate, requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, problemController.getProblems);
router.get('/:id', problemController.getProblem);

router.post('/', authenticate, requireAdmin, problemController.createProblem);
router.put('/:id', authenticate, requireAdmin, problemController.updateProblem);
router.delete('/:id', authenticate, requireAdmin, problemController.deleteProblem);

export default router;