'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = ['Bug', 'Feature Request', 'Improvement', 'Other'];

export default function FeedbackForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Improvement',
        submitterName: '',
        submitterEmail: '',
    });
    const [aiResult, setAiResult] = useState<any>(null);

    const formatResetTime = (resetTime: string) => {
        if (!resetTime) return 'soon';
        const resetDate = new Date(resetTime);
        const now = new Date();
        const diffMs = resetDate.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / 60000);

        if (diffMins <= 0) return 'momentarily';
        if (diffMins < 60) return `in ${diffMins} minutes`;
        return `at ${resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setAiResult(result.data);
                setFormData({
                    title: '',
                    description: '',
                    category: 'Improvement',
                    submitterName: '',
                    submitterEmail: '',
                });
            } else {
                setStatus('error');
                if (response.status === 429 && result.resetTime) {
                    setErrorMessage(`Too many submissions. Try again ${formatResetTime(result.resetTime)}`);
                } else {
                    setErrorMessage(result.message || 'Failed to submit feedback. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage('Could not connect to the server. Please check your internet connection.');
        }
    };

    if (status === 'success' && aiResult) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Feedback Received!</h2>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 mb-8 text-left border border-zinc-100 dark:border-zinc-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-500 uppercase tracking-wider">AI Insights</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed italic">
                        "{aiResult.ai_summary}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {aiResult.ai_tags?.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs rounded-full border border-zinc-200 dark:border-zinc-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:scale-[1.02] transition-transform active:scale-[0.98]"
                >
                    Submit Another Feedback
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-zinc-100 dark:border-zinc-800"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-100 dark:shadow-none">
                    <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Share your feedback</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Help us improve the product with your insights.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name (Optional)</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white"
                            value={formData.submitterName}
                            onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email (Optional)</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white"
                            value={formData.submitterEmail}
                            onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Feedback Type</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat })}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.category === cat
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                    <input
                        required
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Detailed Feedback</label>
                        <span className={`text-xs font-medium ${formData.description.length < 20 ? 'text-amber-500' :
                            formData.description.length > 900 ? 'text-red-500' : 'text-zinc-400'
                            }`}>
                            {formData.description.length} / 1000
                        </span>
                    </div>
                    <textarea
                        required
                        rows={5}
                        maxLength={1000}
                        placeholder="Please provide as much detail as possible (min 20 characters)..."
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {formData.description.length > 0 && formData.description.length < 20 && (
                        <p className="text-[10px] text-amber-500 font-medium px-1 italic">
                            At least {20 - formData.description.length} more characters needed for AI analysis.
                        </p>
                    )}
                </div>

                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-zinc-200 dark:shadow-none"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI Analyzing...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Send Feedback
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
