import express from 'express';
import * as executionController from '../controllers/execution.controller';

const router = express.Router();

router.post('/', executionController.runCode);

export default router;