import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// MongoDB Connection Function
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is strictly required in .env');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1); // Stop the server if the database fails to connect
    }
};

// Start Server
const startServer = async () => {
    // Connect to the database first
    await connectDB();

    // Health check route (Useful for testing before adding real routes)
    app.get('/api/health', (req: Request, res: Response) => {
        res.status(200).json({ success: true, message: 'FeedPulse API is running' });
    });

    // Listen for requests
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
};

startServer();