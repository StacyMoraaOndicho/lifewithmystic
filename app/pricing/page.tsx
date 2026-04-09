'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, PenTool, Loader2, Smartphone, Globe, CreditCard, X, ChevronRight, AlertCircle } from 'lucide-react';
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
      'M-Pesa & Card Support'
    ],
    buttonText: 'Start Writing',
    action: 'subscribe',
    highlight: true,
    icon: <PenTool className="w-6 h-6" />
  }
];

const paymentMethods = [
  {
    id: 'paystack_mpesa',
    name: 'M-Pesa / Mobile Money',
    description: 'Direct STK Push or manual transfer',
    icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
    tag: 'Kenya Special'
  },
  {
    id: 'paystack_card',
    name: 'Credit / Debit Card',
    description: 'Supports all African and Global cards',
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    tag: 'Africa & Global'
  },
  {
    id: 'paystack_bank',
    name: 'Bank Transfer',
    description: 'Secure direct bank payments',
    icon: <CreditCard className="w-5 h-5 text-yellow-500" />,
    tag: 'Direct'
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAction = async (plan: any) => {
    if (plan.action === 'signup') {
      router.push('/signup');
      return;
    }

    if (!user) {
      router.push('/signup?plan=writer');
      return;
    }

    setShowPaymentOptions(true);
  };

  const handlePaymentMethod = async (methodId: string) => {
    setLoading(methodId);
    setErrorMessage(null);
    
    try {
      const res = await fetch('/api/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          userEmail: user?.email,
          amount: 9, // $9.00
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || 'Gateway is currently unavailable.');
      }
    } catch (err) {
      setErrorMessage('A connection error occurred. Please check your internet.');
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
            className="text-5xl md:text-6xl font-light mb-6 text-[var(--text)] tracking-tight uppercase"
          >
            Choose your <span className="text-[var(--accent)] italic font-serif capitalize">Path</span>
          </motion.h1>
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
                  ? 'border-[var(--accent)] bg-[var(--accent)]/[0.03]' 
                  : 'border-[var(--text)]/10 bg-[var(--text)]/[0.02]'
              } flex flex-col`}
            >
              <h3 className="text-2xl font-light text-[var(--text)] uppercase tracking-[0.2em] mb-6">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-6xl font-light text-[var(--text)]">{plan.price}</span>
                {plan.period && <span className="text-[var(--text)]/40 text-sm uppercase tracking-[0.3em] ml-2">{plan.period}</span>}
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm text-[var(--text)]/70">
                    <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleAction(plan)}
                className={`w-full py-5 rounded-2xl text-center uppercase tracking-[0.3em] text-xs font-bold transition-all ${
                  plan.highlight ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative"
              >
                <button onClick={() => setShowPaymentOptions(false)} className="absolute top-8 right-8 p-2 text-white/20 hover:text-white"><X /></button>

                <div className="text-center mb-10">
                  <h2 className="text-2xl font-light text-white mb-2 uppercase tracking-widest">Payment Gateway</h2>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Kenya & Africa Optimized</p>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethod(method.id)}
                      disabled={!!loading}
                      className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/30 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-white/5">{method.icon}</div>
                        <div className="text-left">
                          <h4 className="text-white font-medium">{method.name}</h4>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{method.tag}</p>
                        </div>
                      </div>
                      {loading === method.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 text-white/10" />}
                    </button>
                  ))}
                </div>

                {errorMessage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest">{errorMessage}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
