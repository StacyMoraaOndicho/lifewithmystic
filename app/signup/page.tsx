'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function SignupContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    // Stricter Signup check
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback${plan === 'writer' ? '?next=/pricing' : ''}`,
      },
    });

    if (error) {
      setError(true);
      if (error.message.includes('already registered')) {
        setMessage('Identity already exists. Please log in instead.');
      } else {
        setMessage(`Sacred Error: ${error.message}`);
      }
    } else if (data.user && data.session === null) {
      // This means email confirmation is required and working
      setMessage('A confirmation link has been sent to your inbox.');
    } else if (data.user && data.session) {
      // Auto-confirmed (Confirm Email is OFF in Supabase)
      setMessage('Account created. Redirecting...');
      router.push(plan === 'writer' ? '/pricing' : '/blog');
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-[40px] border border-white/10 bg-[#0a0a0a] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 uppercase tracking-[0.2em]">
            Join the <span className="italic text-[var(--accent)] font-serif">Mystery</span>
          </h1>
          <p className="text-white/40 italic text-sm">
            {plan === 'writer' ? 'Initiating your creator profile...' : 'Begin your journey into the sanctuary.'}
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
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
            <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono font-bold">Passphrase</label>
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
            {loading ? 'Transmitting...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-5 rounded-2xl text-center border ${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest">{message}</p>
          </motion.div>
        )}

        <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
          <p className="text-sm text-white/40">
            Already a member? <Link href="/login" className="text-[var(--accent)] hover:underline">Log in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
