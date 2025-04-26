import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, requireAuth, authController.getCurrentUser);

export default router;