'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Check your email to confirm!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Subscription failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass-strong p-8 rounded-xl my-12"
    >
      <div className="max-w-md">
        <h3 className="text-2xl font-light text-white mb-2">Stay Updated</h3>
        <p className="text-white/70 text-sm mb-4">
          Get new essays delivered to your inbox. No spam, only wisdom.
        </p>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-4 p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-200 border border-green-500/50'
                : 'bg-red-500/20 text-red-200 border border-red-500/50'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:glass-light"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-rose-400 text-black font-semibold rounded-lg hover:from-amber-300 hover:to-rose-300 disabled:opacity-50 transition-all"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
