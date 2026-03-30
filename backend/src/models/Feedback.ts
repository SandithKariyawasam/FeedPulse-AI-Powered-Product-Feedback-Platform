import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    title: string;
    description: string;
    category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
    status: 'New' | 'In Review' | 'Resolved';
    submitterName?: string;
    submitterEmail?: string;
    ai_category?: string;
    ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
    ai_priority?: number;
    ai_summary?: string;
    ai_tags?: string[];
    ai_processed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        title: { type: String, required: true, maxlength: 120 }, // [cite: 101]
        description: { type: String, required: true, minlength: 20 }, // [cite: 102]
        category: {
            type: String,
            enum: ['Bug', 'Feature Request', 'Improvement', 'Other'],
            required: true
        }, // [cite: 103]
        status: {
            type: String,
            enum: ['New', 'In Review', 'Resolved'],
            default: 'New'
        }, // [cite: 103]
        submitterName: { type: String, required: false }, // [cite: 104]
        submitterEmail: {
            type: String,
            required: false,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        }, // [cite: 105]

        // AI fields populated after Gemini responds [cite: 106]
        ai_category: { type: String }, // [cite: 107]
        ai_sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] }, // [cite: 108]
        ai_priority: { type: Number, min: 1, max: 10 }, // [cite: 109]
        ai_summary: { type: String }, // [cite: 110]
        ai_tags: { type: [String] }, // [cite: 111]
        ai_processed: { type: Boolean, default: false }, // [cite: 112]
    },
    { timestamps: true } // Auto-manages createdAt and updatedAt [cite: 113, 114, 115]
);

// Required Indexes for query performance 
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);