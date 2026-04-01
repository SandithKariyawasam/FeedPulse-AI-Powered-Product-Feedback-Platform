import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Controller to handle admin login.
 * Signs a JWT for the admin if the password matches.
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const secret = process.env.JWT_SECRET || 'fallback_secret';

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and Password are required' });
        }

        if (email === adminEmail && password === adminPassword) {
            // Sign token for 24 hours
            const token = jwt.sign({ isAdmin: true, sub: 'admin', email: adminEmail }, secret, { expiresIn: '24h' });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Login successful', 
                token 
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
