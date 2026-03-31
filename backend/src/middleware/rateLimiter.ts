import { rateLimit } from 'express-rate-limit';

/**
 * Rate limiter middleware to prevent spam.
 * Limit: 5 submissions per 1 hour from a single IP.
 */
export const feedbackRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        success: false,
        message: 'Too many feedback submissions from this IP. Please try again after an hour.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json({
            success: false,
            message: options.message,
            resetTime: (req as any).rateLimit?.resetTime,
        });
    },
});
