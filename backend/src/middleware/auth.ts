import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to verify JWT token for admin routes.
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('❌ JWT_SECRET is not configured in .env');
            return res.status(500).json({ success: false, message: 'Internal Server Error: Authentication misconfigured' });
        }

        const decoded = jwt.verify(token, secret!) as any;

        if (decoded && decoded.isAdmin) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
        }
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
