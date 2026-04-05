'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, PenTool, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Seeker',
    price: 'Free',
    description: 'For those who wish to read and reflect.',
    features: [
      'Access to all public essays',
      'Like and Comment on posts',
      'Personal Reading Graph',
      'Weekly newsletter'
    ],
    buttonText: 'Join as Seeker',
    action: 'signup',
    highlight: false
  },
  {
    name: 'Writer',
    price: '$9',
    period: '/mo',
    description: 'For creators, philosophers, and storytellers.',
    features: [
      'Publish unlimited essays',
      'Personal Writer Portfolio',
      'Promote Ebooks & Digital Products',
      'Analytics Dashboard',
      'Custom Newsletter for your followers',
      '5% Platform Fee on sales'
    ],
    buttonText: 'Start Writing',
    action: 'subscribe',
    highlight: true,
    icon: <PenTool className="w-6 h-6" />
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (plan: any) => {
    if (plan.action === 'signup') {
      router.push('/signup');
      return;
    }

    if (!user) {
      router.push('/signup?plan=writer');
      return;
    }

    setLoading(plan.name);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen py-24 px-6 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-light mb-6 text-[var(--text)] tracking-tight"
          >
            The Creator <span className="text-[var(--accent)] italic font-serif">Sanctuary</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text)]/50 text-xl font-light max-w-2xl mx-auto leading-relaxed italic"
          >
            Choose your path. Whether you are here to absorb the light or to radiate your own wisdom, there is a place for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`relative p-10 rounded-[40px] border ${
                plan.highlight 
                  ? 'border-[var(--accent)] bg-[var(--accent)]/[0.03] shadow-[0_0_40px_-15px_rgba(var(--accent-rgb),0.3)]' 
                  : 'border-[var(--text)]/10 bg-[var(--text)]/[0.02]'
              } flex flex-col`}
            >
              {plan.highlight && (
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(255, 255, 255, 0.3)",
                      "0 0 30px rgba(255, 255, 255, 0.8)",
                      "0 0 10px rgba(255, 255, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full z-10"
                >
                  Most Chosen
                </motion.div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--text)]/10 text-[var(--text)]/40'}`}>
                    {plan.icon || <Star className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-light text-[var(--text)] uppercase tracking-[0.2em]">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-6xl font-light text-[var(--text)]">{plan.price}</span>
                  <span className="text-[var(--text)]/40 text-sm uppercase tracking-[0.3em] ml-2">{plan.period}</span>
                </div>
                <p className="text-[var(--text)]/60 text-sm leading-relaxed italic">{plan.description}</p>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm text-[var(--text)]/70">
                    <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                    <span className="leading-relaxed font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleAction(plan)}
                disabled={loading === plan.name}
                className={`w-full py-5 rounded-2xl text-center uppercase tracking-[0.3em] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-[var(--accent)] text-[var(--bg)] hover:shadow-2xl hover:scale-[1.02]'
                    : 'bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10 hover:bg-[var(--text)]/10'
                } disabled:opacity-50`}
              >
                {loading === plan.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  plan.buttonText
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 p-12 rounded-[40px] border border-[var(--text)]/5 bg-[var(--text)]/[0.01] text-center"
        >
          <div className="flex justify-center gap-10 mb-8 flex-wrap opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
            <Zap className="w-8 h-8" />
            <Star className="w-8 h-8" />
            <PenTool className="w-8 h-8" />
          </div>
          <h4 className="text-[var(--text)]/40 uppercase tracking-[0.6em] text-[10px] mb-6 font-mono font-bold">The Collective Advantage</h4>
          <p className="text-[var(--text)]/60 max-w-2xl mx-auto text-sm leading-relaxed italic font-light">
            All voices in the sanctuary benefit from automated spiritual SEO, ethereal social sharing tools, and direct transmission to our expanding circle of over 10,000+ monthly seekers.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
