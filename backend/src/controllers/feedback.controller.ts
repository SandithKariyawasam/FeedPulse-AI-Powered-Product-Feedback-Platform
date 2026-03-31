import { type Request, type Response } from 'express';
import Feedback from '../models/Feedback.js';
import { analyzeFeedback, generateSummaryReport } from '../services/gemini.service.js';

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { title, description, category, submitterName, submitterEmail } = req.body;

        // Basic validation
        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const feedback = new Feedback({
            title,
            description,
            category,
            submitterName,
            submitterEmail,
        });

        const aiAnalysis = await analyzeFeedback(title, description);
        
        feedback.ai_category = aiAnalysis.ai_category;
        feedback.ai_sentiment = aiAnalysis.ai_sentiment;
        feedback.ai_priority = aiAnalysis.ai_priority;
        feedback.ai_summary = aiAnalysis.ai_summary;
        feedback.ai_tags = aiAnalysis.ai_tags;
        feedback.ai_processed = true;

        await feedback.save();

        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('❌ Feedback creation error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getAllFeedback = async (req: Request, res: Response) => {
    try {
        // Fetch feedback, sorting by priority (high first) and date (new first)
        const feedbacks = await Feedback.find().sort({ ai_priority: -1, createdAt: -1 });

        res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (error) {
        console.error('❌ Fetch feedback error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getFeedbackSummary = async (req: Request, res: Response) => {
    try {
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const recentFeedback = await Feedback.find({
            createdAt: { $gte: lastWeek }
        });

        if (recentFeedback.length === 0) {
            return res.status(200).json({ 
                success: true, 
                data: { themes: [], overall_summary: 'No recent feedback to analyze.' }
            });
        }

        const summary = await generateSummaryReport(recentFeedback);
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        console.error('❌ Summary generation error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const retriggerAIAnalysis = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        // Re-run AI analysis
        const aiAnalysis = await analyzeFeedback(feedback.title, feedback.description);

        // Update with new insights
        feedback.ai_category = aiAnalysis.ai_category;
        feedback.ai_sentiment = aiAnalysis.ai_sentiment;
        feedback.ai_priority = aiAnalysis.ai_priority;
        feedback.ai_summary = aiAnalysis.ai_summary;
        feedback.ai_tags = aiAnalysis.ai_tags;
        feedback.ai_processed = true;

        await feedback.save();

        res.status(200).json({ 
            success: true, 
            message: 'AI Analysis re-triggered successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('❌ Retrigger AI error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('❌ Delete feedback error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['New', 'In Review', 'Resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Status updated successfully', 
            data: feedback 
        });
    } catch (error) {
        console.error('❌ Update status error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
