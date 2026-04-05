'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! Logging you in...');
      setTimeout(() => router.push('/blog'), 1000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] shadow-2xl relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-[var(--text)] mb-2">Welcome Back</h1>
          <p className="text-[var(--text)]/40 italic font-light uppercase tracking-widest text-[10px]">Re-enter the sacred space</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-[var(--text)]/60 font-mono">Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="name@email.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-widest text-[var(--text)]/60 font-mono">Secret (Password)</label>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-[var(--accent)] text-[var(--bg)] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all font-semibold uppercase tracking-[0.2em] text-sm disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Log In'}
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center text-sm ${message.includes('Error') ? 'text-red-400' : 'text-[var(--accent)]'}`}
          >
            {message}
          </motion.p>
        )}

        <div className="mt-10 pt-8 border-t border-[var(--text)]/5 text-center flex flex-col gap-4">
          <p className="text-sm text-[var(--text)]/40">
            First time here? <Link href="/signup" className="text-[var(--accent)] hover:underline">Begin your journey</Link>
          </p>
          <Link href="/blog" className="text-[10px] text-[var(--text)]/30 hover:text-[var(--accent)] transition-colors uppercase tracking-[0.3em]">Return to Blog</Link>
        </div>
      </motion.div>
    </main>
  );
}
