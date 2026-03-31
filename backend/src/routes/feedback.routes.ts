import { Router } from 'express';
import { createFeedback, getAllFeedback, getFeedbackSummary, retriggerAIAnalysis, deleteFeedback, updateFeedbackStatus } from '../controllers/feedback.controller.js';
import { login } from '../controllers/auth.controller.js';
import { feedbackRateLimiter } from '../middleware/rateLimiter.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/', feedbackRateLimiter, createFeedback);
router.post('/login', login);
router.get('/summary', feedbackRateLimiter, getFeedbackSummary);
router.patch('/retrigger/:id', verifyToken, retriggerAIAnalysis);
router.patch('/status/:id', verifyToken, updateFeedbackStatus);
router.delete('/:id', verifyToken, deleteFeedback);
router.get('/', verifyToken, getAllFeedback);

export default router;
