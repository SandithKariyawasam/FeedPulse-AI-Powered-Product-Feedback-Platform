'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, Loader2, RefreshCw } from 'lucide-react';

export default function InsightCard() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/feedback/summary`);
            const result = await response.json();
            if (result.success) {
                setSummary(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImpactIcon = (impact: string) => {
        switch (impact.toLowerCase()) {
            case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'medium': return <TrendingUp className="w-4 h-4 text-amber-500" />;
            default: return <Lightbulb className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="w-full max-w-4xl mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-amber-500" />
                        Product Insights
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        AI-generated themes from the last 7 days of feedback.
                    </p>
                </div>
                <button 
                    onClick={fetchSummary}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Generate On-Demand Summary
                </button>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700"
                    >
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                        <p className="text-zinc-500 font-medium">Gemini is crunching the numbers...</p>
                    </motion.div>
                ) : summary ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-amber-500 rounded-3xl p-8 text-white shadow-xl shadow-amber-100 dark:shadow-none">
                            <h3 className="text-lg font-semibold mb-2 opacity-80 uppercase tracking-wider">Overall Trend</h3>
                            <p className="text-xl font-medium leading-relaxed">
                                {summary.overall_summary}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {summary.themes?.map((theme: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-none"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
                                            {theme.count} Feedbacks
                                        </div>
                                        {getImpactIcon(theme.impact)}
                                    </div>
                                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{theme.theme}</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                        {theme.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            theme.impact.toLowerCase() === 'high' ? 'bg-red-100 text-red-600' :
                                            theme.impact.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {theme.impact} Impact
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <p className="text-zinc-400 font-medium">Click the button above to analyze recent feedback.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
