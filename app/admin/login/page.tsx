'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { signInEmail, signInBiometric } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'email' | 'biometric'>('email');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInEmail(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInBiometric();
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass p-8 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl font-light tracking-wide mb-2"
            >
              Admin Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white/60"
            >
              Sacred space for writers
            </motion.p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6 glass-light p-1 rounded-lg">
            <button
              onClick={() => setMode('email')}
              className={`flex-1 py-2 rounded-md transition-all ${
                mode === 'email'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMode('biometric')}
              className={`flex-1 py-2 rounded-md transition-all ${
                mode === 'biometric'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Biometric
            </button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Email mode */}
          {mode === 'email' && (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleEmailSignIn}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center text-sm text-white/60">
                Don't have an account?{' '}
                <Link href="/admin/signup" className="text-amber-400 hover:text-amber-300">
                  Sign up
                </Link>
              </div>
            </motion.form>
          )}

          {/* Biometric mode */}
          {mode === 'biometric' && (
            <motion.div
              key="biometric"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🔐
                </motion.div>
                <p className="text-white/70 mb-6">
                  Use your fingerprint or face to access the admin portal
                </p>
              </div>

              <button
                onClick={handleBiometricSignIn}
                disabled={loading}
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>👆</span>
                    Authenticate Now
                  </>
                )}
              </button>

              <p className="text-xs text-white/50 text-center">
                Your biometric data is never stored or transmitted. Authentication happens locally on your device.
              </p>
            </motion.div>
          )}
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link href="/" className="text-white/60 hover:text-white/80 transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
