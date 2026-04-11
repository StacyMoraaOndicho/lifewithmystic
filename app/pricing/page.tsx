'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, PenTool, Loader2, Smartphone, Globe, CreditCard, X, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';

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
    highlight: false,
    icon: <Star className="w-5 h-5 text-white/40" />
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
    icon: <PenTool className="w-5 h-5 text-[var(--accent)]" />
  }
];

const paymentMethods = [
  { id: 'paystack_mpesa', name: 'M-Pesa / Mobile Money', icon: <Smartphone className="w-5 h-5 text-emerald-500" />, tag: 'Kenya Special' },
  { id: 'paystack_card', name: 'Credit / Debit Card', icon: <Globe className="w-5 h-5 text-blue-400" />, tag: 'Africa & Global' },
  { id: 'paystack_bank', name: 'Bank Transfer', icon: <CreditCard className="w-5 h-5 text-yellow-500" />, tag: 'Direct' }
];

function PricingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AUTO-TRIGGER: Open payment options if they just confirmed email
  useEffect(() => {
    if (searchParams.get('status') === 'confirmed' && user) {
      setShowPaymentOptions(true);
    }
  }, [searchParams, user]);

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
        body: JSON.stringify({ userId: user?.id, userEmail: user?.email }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || 'Gateway unavailable.');
      }
    } catch (err) {
      setErrorMessage('Connection error.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen py-24 px-6 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16 font-light">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-light mb-6 text-white tracking-tight uppercase"
          >
            Choose your <span className="italic font-serif text-[var(--accent)]">Path</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-sm italic max-w-xl mx-auto leading-relaxed"
          >
            Whether you are here to absorb the light or to radiate your own wisdom, there is a place for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`relative p-12 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col`}
            >
              {plan.highlight && (
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 glass rounded-lg shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] z-20 border border-white/20"
                >
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">Most Chosen</span>
                </div>
              )}

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-light text-white uppercase tracking-[0.2em]">{plan.name}</h3>
                  {plan.icon}
                </div>
                <p className="text-white/30 text-xs italic mb-8 leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-7xl font-light text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/20 text-xs uppercase tracking-widest ml-2">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-6 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm text-white/60">
                    <Check className="w-4 h-4 text-white/20 mt-0.5" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleAction(plan)}
                className={`w-full py-5 rounded-2xl text-center uppercase tracking-[0.3em] text-[10px] font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                    : 'bg-transparent text-white border border-white/10 hover:bg-white/5'
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
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
            >
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-12 relative shadow-3xl text-center">
                <button onClick={() => setShowPaymentOptions(false)} className="absolute top-10 right-10 p-2 text-white/20 hover:text-white"><X className="w-6 h-6" /></button>
                <h2 className="text-3xl font-light text-white mb-2 uppercase tracking-[0.2em]">Select Gateway</h2>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-12">Kenya & Africa Optimized</p>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button 
                      key={method.id} 
                      onClick={() => handlePaymentMethod(method.id)} 
                      disabled={!!loading} 
                      className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-white/5">{method.icon}</div>
                        <div className="text-left">
                          <h4 className="text-white font-medium text-sm">{method.name}</h4>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{method.tag}</p>
                        </div>
                      </div>
                      {loading === method.id ? <Loader2 className="w-4 h-4 animate-spin text-white/20" /> : <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />}
                    </button>
                  ))}
                </div>
                {errorMessage && <p className="mt-8 text-[10px] uppercase font-bold tracking-widest text-red-500">{errorMessage}</p>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-[10px] uppercase tracking-[0.5em]">Initializing Gateway...</div>}>
      <PricingContent />
    </Suspense>
  );
}
