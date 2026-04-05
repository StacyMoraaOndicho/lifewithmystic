'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-[var(--text)]/10 bg-[var(--bg)] shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-[var(--text)] mb-2">Join the Mystery</h1>
          <p className="text-[var(--text)]/40 italic">Create an account to like and reflect on essays.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--text)]/60 mb-2 font-mono">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--text)]/60 mb-2 font-mono">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-all font-semibold uppercase tracking-[0.2em] text-sm disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-[var(--accent)]"
          >
            {message}
          </motion.p>
        )}

        <div className="mt-10 pt-6 border-t border-[var(--text)]/5 text-center">
          <p className="text-sm text-[var(--text)]/40">
            Already a member? <Link href="/login" className="text-[var(--accent)] hover:underline">Login here</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
