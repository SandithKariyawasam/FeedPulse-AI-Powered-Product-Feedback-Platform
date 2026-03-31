'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/feedback/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                router.push('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 selection:bg-amber-100 dark:selection:bg-amber-900/40">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-900/10 pointer-events-none -z-10" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl shadow-amber-100 dark:shadow-none border border-zinc-100 dark:border-zinc-800"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Verify your pulse to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1 font-sans">
                            Admin Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin email address..."
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white font-medium placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1 font-sans">
                            Master Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password..."
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white font-medium placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-semibold border border-red-100 dark:border-red-900/30"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-100 dark:shadow-none hover:bg-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Access Portal'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <button 
                        onClick={() => router.push('/')}
                        className="text-sm font-bold text-zinc-400 hover:text-amber-500 transition-colors uppercase tracking-widest px-4 py-2"
                    >
                        Back to Public Page
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
