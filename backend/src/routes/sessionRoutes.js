// src/routes/sessionRoutes.js
import express from 'express';
import { createSession, getTodaySessions } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/sessions', createSession);
router.get('/sessions/today', getTodaySessions);

export default router;
