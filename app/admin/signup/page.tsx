'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 tracking-widest uppercase">Admin Signup</h1>
          <p className="text-white/40 italic text-xs uppercase tracking-[0.3em]">Become a creator in the sanctuary</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono">Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 transition-all font-light"
              placeholder="admin@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono">Secret (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className={`text-center text-xs font-mono uppercase tracking-widest ${error.includes('Check your email') ? 'text-amber-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all font-bold uppercase tracking-[0.2em] text-sm disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Already have an account?</p>
          <Link href="/admin/login" className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] hover:underline">Log in to Portal</Link>
          <Link href="/" className="text-[10px] text-white/30 hover:text-amber-400 transition-colors uppercase tracking-[0.3em] mt-4">← Return to Sanctuary</Link>
        </div>
      </motion.div>
    </main>
  );
}
