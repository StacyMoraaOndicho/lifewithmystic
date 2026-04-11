'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const MASTER_ADMIN = "lifewithmystic@gmail.com";

export default function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // STRICTOR SECURITY: Only the primary architect can register
    if (email.toLowerCase() !== MASTER_ADMIN) {
      setError('Forbidden: This identity cannot be registered as an Architect.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Initiation successful. Please check your inbox to finalize your identity.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-[40px] border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 tracking-widest uppercase">Admin Initiation</h1>
          <p className="text-white/40 italic text-[10px] uppercase tracking-[0.3em]">Exclusive to the primary architect</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono font-bold">Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="lifewithmystic@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono font-bold">Secret Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl border ${error.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-5 rounded-2xl bg-[var(--accent)] text-[var(--bg)] hover:shadow-2xl transition-all font-bold uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
          >
            {loading ? 'Initiating...' : 'Register Architect'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <Link href="/admin/login" className="text-[9px] text-[var(--accent)] hover:underline transition-colors uppercase tracking-[0.4em] font-bold">Already initiated? Log In</Link>
        </div>
      </motion.div>
    </main>
  );
}
