import express from 'express';
import { executeCode } from '../controllers/codeController.js';

const router = express.Router();

// No auth required for code execution in rooms
router.post('/execute', executeCode);

export default router;
