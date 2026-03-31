import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the schema for structured output
const feedbackSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        ai_category: {
            type: SchemaType.STRING,
            description: "Category of the feedback: Bug, Feature Request, Improvement, or Other",
        },
        ai_sentiment: {
            type: SchemaType.STRING,
            description: "Sentiment of the feedback: Positive, Neutral, or Negative",
        },
        ai_priority: {
            type: SchemaType.NUMBER,
            description: "Overall priority score from 1 (low) to 10 (high)",
        },
        ai_summary: {
            type: SchemaType.STRING,
            description: "A concise 1-sentence summary of the user's feedback",
        },
        ai_tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3-5 relevant keyword tags for this feedback",
        },
    },
    required: ["ai_category", "ai_sentiment", "ai_priority", "ai_summary", "ai_tags"],
};

// Schema for Summary Report
const summarySchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        themes: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    theme: { type: SchemaType.STRING, description: "Theme name (e.g., Performance, Dark Mode, Onboarding)" },
                    description: { type: SchemaType.STRING, description: "Detailed description of what users are sayin about this theme" },
                    count: { type: SchemaType.NUMBER, description: "Approximate number of feedbacks related to this" },
                    impact: { type: SchemaType.STRING, description: "High, Medium, or Low" }
                },
                required: ["theme", "description", "count", "impact"]
            },
            description: "Exactly 3 major themes identified"
        },
        overall_summary: {
            type: SchemaType.STRING,
            description: "A 2-3 sentence overview of all feedback trends"
        }
    },
    required: ["themes", "overall_summary"]
};

export const analyzeFeedback = async (title: string, description: string) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            // System instructions help guide the "personality" and behavior
            systemInstruction: "You are an expert product analyst. Analyze user feedback and output structured JSON based on the provided schema. Be objective and prioritize critical bugs or high-impact feature requests."
        });

        const prompt = `Title: ${title}\nDescription: ${description}`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
            },
        });

        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error('❌ AI Analysis failed:', error);
        return {
            ai_category: 'Other',
            ai_sentiment: 'Neutral',
            ai_priority: 5,
            ai_summary: 'AI processing failed for this feedback.',
            ai_tags: ['processing-failed'],
        };
    }
};

export const generateSummaryReport = async (feedbacks: any[]) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "You are a product management consultant. Summarize the provided user feedback into the top 3 most important themes to address. Be concise and action-oriented."
        });

        const dataStr = feedbacks.map(f => `[${f.category}] ${f.title}: ${f.description}`).join('\n---\n');
        const prompt = `Analyze these feedback entries and provide a summary report:\n\n${dataStr}`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
            },
        });

        return JSON.parse(result.response.text());
    } catch (error) {
        console.error('❌ Summary generation failed:', error);
        return {
            themes: [],
            overall_summary: "Failed to generate AI summary report."
        };
    }
};
