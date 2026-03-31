'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    RefreshCw,
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Minus,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Calendar,
    User,
    Tag,
    Trash2,
    Inbox,
    Clock,
    CheckCircle,
    ArrowUpDown,
    MessageSquare,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [retriggering, setRetriggering] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    const fetchFeedbacks = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/feedback', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setFeedbacks(result.data);
            } else {
                // If unauthorized, go back to login
                if (response.status === 401 || response.status === 403) {
                    router.push('/admin/login');
                }
            }
        } catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRetrigger = async (id: string) => {
        setRetriggering(id);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:4000/api/feedback/retrigger/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                // Update specific item in state
                setFeedbacks(prev => prev.map(f => f._id === id ? result.data : f));
            }
        } catch (error) {
            console.error('Retrigger failed:', error);
        } finally {
            setRetriggering(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        setDeleting(id);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:4000/api/feedback/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setFeedbacks(prev => prev.filter(f => f._id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setDeleting(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingStatus(id);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:4000/api/feedback/status/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                setFeedbacks(prev => prev.map(f => f._id === id ? result.data : f));
            }
        } catch (error) {
            console.error('Status update failed:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
            f.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || f.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'Oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'Priority') return (b.ai_priority || 0) - (a.ai_priority || 0);
        if (sortBy === 'Sentiment') {
            const sentimentScore: any = { 'Positive': 3, 'Neutral': 2, 'Negative': 1 };
            return (sentimentScore[b.ai_sentiment || 'Neutral']) - (sentimentScore[a.ai_sentiment || 'Neutral']);
        }
        return 0;
    });

    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
    const paginatedFeedbacks = filteredFeedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterCategory, filterStatus, sortBy]);

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
            case 'negative': return <TrendingDown className="w-4 h-4 text-rose-500" />;
            default: return <Minus className="w-4 h-4 text-zinc-400" />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'New': return <Inbox className="w-4 h-4 text-blue-500" />;
            case 'In Review': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'Resolved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            default: return null;
        }
    };

    // Calculate Stats
    const stats = {
        total: feedbacks.length,
        open: feedbacks.filter(f => f.status !== 'Resolved').length,
        avgPriority: feedbacks.length > 0
            ? (feedbacks.reduce((acc, f) => acc + (f.ai_priority || 0), 0) / feedbacks.length).toFixed(1)
            : 0,
        mostCommonTag: (() => {
            const tags = feedbacks.flatMap(f => f.ai_tags || []);
            if (tags.length === 0) return 'None';
            const counts: any = {};
            tags.forEach(t => counts[t] = (counts[t] || 0) + 1);
            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        })()
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black p-6 md:p-12 lg:p-20 selection:bg-amber-100 dark:selection:bg-amber-900/40">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Admin Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Feedback Pulse Center</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Manage and optimize user feedback with AI-driven insights.</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                >
                    <LogOut className="w-4 h-4" />
                    Logout Session
                </button>
            </div>

            {/* Stats Bar */}
            <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Feedback', value: stats.total, icon: <MessageSquare className="w-6 h-6" />, color: 'bg-amber-500' },
                    { label: 'Open Items', value: stats.open, icon: <Clock className="w-6 h-6" />, color: 'bg-amber-500' },
                    { label: 'Avg Priority', value: stats.avgPriority, icon: <Zap className="w-6 h-6" />, color: 'bg-rose-500' },
                    { label: 'Top Theme', value: stats.mostCommonTag, icon: <Tag className="w-6 h-6" />, color: 'bg-emerald-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-100 dark:shadow-none`}>
                            {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-7 h-7 text-white' } as any)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto mb-10 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search feedback content..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white font-medium"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                    {/* Category Filter */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</span>
                        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            {['All', 'Bug', 'Feature Request', 'Improvement', 'Other'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterCategory === cat ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</span>
                        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            {['All', 'New', 'In Review', 'Resolved'].map(stat => (
                                <button
                                    key={stat}
                                    onClick={() => setFilterStatus(stat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === stat ? 'bg-amber-500 text-white ' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                >
                                    {stat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <ArrowUpDown className="w-3 h-3" />
                            Sort By
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 outline-none shadow-sm cursor-pointer hover:border-amber-500 transition-colors"
                        >
                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>
                            <option value="Priority">Priority (High-Low)</option>
                            <option value="Sentiment">Sentiment (Best-Worst)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto space-y-6">
                <AnimatePresence initial={false} mode="wait">
                    {paginatedFeedbacks.map((f, idx) => (
                        <motion.div
                            key={f._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none group"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side: Content */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${f.ai_priority >= 8 ? 'bg-rose-500 text-white' : f.ai_priority >= 5 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'} shadow-lg shadow-zinc-100 dark:shadow-none`}>
                                            Priority {f.ai_priority}
                                        </span>
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full shadow-sm">
                                            {getStatusIcon(f.status)}
                                            <select
                                                value={f.status}
                                                onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                                                disabled={updatingStatus === f._id}
                                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 outline-none cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="New">New</option>
                                                <option value="In Review">In Review</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                        <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {f.category}
                                        </span>
                                        {f.ai_sentiment && (
                                            <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-full">
                                                {getSentimentIcon(f.ai_sentiment)}
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                    {f.ai_sentiment} Sentiment
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">{f.title}</h3>
                                        <div className="bg-zinc-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 italic text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            "{f.description}"
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {f.submitterName || 'Anonymous'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(f.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            {f.ai_tags?.join(', ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: AI Insight & Actions */}
                                <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800 pt-8 lg:pt-0 lg:pl-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-zinc-400 uppercase text-[10px] font-black tracking-widest mb-2">
                                            <AlertCircle className="w-4 h-4" />
                                            AI Summary
                                        </div>
                                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100/50 dark:border-amber-900/20">
                                            {f.ai_summary || "Processing..."}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => handleRetrigger(f._id)}
                                            disabled={retriggering === f._id || deleting === f._id}
                                            className="flex-1 py-4 bg-white dark:bg-zinc-900 border-2 border-amber-500/20 hover:border-amber-500 text-amber-600 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {retriggering === f._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                            Re-trigger
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f._id)}
                                            disabled={retriggering === f._id || deleting === f._id}
                                            className="px-5 py-4 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl font-bold flex items-center justify-center transition-all hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-[0.98] disabled:opacity-50"
                                            title="Delete Feedback"
                                        >
                                            {deleting === f._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredFeedbacks.length === 0 && (
                    <div className="text-center py-40 border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem]">
                        <h3 className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">No feedback pulse detected</h3>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="max-w-7xl mx-auto mt-12 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-all disabled:opacity-30 shadow-sm flex items-center gap-2 font-bold text-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                        Page <span className="text-amber-500">{currentPage}</span> of {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-all disabled:opacity-30 shadow-sm flex items-center gap-2 font-bold text-sm"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
