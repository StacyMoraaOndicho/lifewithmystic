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
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      if (error.message.includes('Email not confirmed')) {
        setMessage('Your identity has not been confirmed. Please check your inbox for the sacred link.');
      } else if (error.message.includes('Invalid login credentials')) {
        setMessage('Invalid credentials. If you are new, please begin your journey at the Sign Up page.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } else if (data.user) {
      setMessage('Success. Re-entering the sanctuary...');
      setTimeout(() => router.push('/blog'), 1500);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-[40px] border border-white/10 bg-[#0a0a0a] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 uppercase tracking-[0.2em]">Welcome <span className="italic text-[var(--accent)] font-serif capitalize">Back</span></h1>
          <p className="text-white/40 italic font-light uppercase tracking-widest text-[10px]">Re-enter the inner sanctuary</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono font-bold">Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="name@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono font-bold">Secret (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-5 rounded-2xl bg-[var(--accent)] text-white hover:shadow-2xl hover:scale-[1.01] transition-all font-bold uppercase tracking-[0.3em] text-[10px] disabled:opacity-50"
          >
            {loading ? 'Transmitting...' : 'Enter Sanctuary'}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-5 rounded-2xl text-center border ${isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest">{message}</p>
          </motion.div>
        )}

        <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
          <p className="text-sm text-white/40">
            Lost your way? <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">Create a new identity</Link>
          </p>
          <Link href="/blog" className="text-[9px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em] font-bold">← Return to the Blog</Link>
        </div>
      </motion.div>
    </main>
  );
}
