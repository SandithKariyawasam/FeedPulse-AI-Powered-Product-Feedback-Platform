import { Router } from 'express';
import { createFeedback, getAllFeedback, getFeedbackSummary, retriggerAIAnalysis, deleteFeedback, updateFeedbackStatus } from '../controllers/feedback.controller.js';
import { login } from '../controllers/auth.controller.js';
import { feedbackRateLimiter } from '../middleware/rateLimiter.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public feedback submission (Rate limited to 5 per hour)
router.post('/', feedbackRateLimiter, createFeedback);

// Admin login
router.post('/login', login);

// Public: AI Summary / Insights (Rate limited for API protection)
router.get('/summary', feedbackRateLimiter, getFeedbackSummary);

// Protected Admin / Internal insights
router.patch('/retrigger/:id', verifyToken, retriggerAIAnalysis);
router.patch('/status/:id', verifyToken, updateFeedbackStatus);
router.delete('/:id', verifyToken, deleteFeedback);

// Protected Admin / Internal: View all raw feedback
router.get('/', verifyToken, getAllFeedback);

export default router;
