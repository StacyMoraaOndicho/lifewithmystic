'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, PenTool, Loader2, Smartphone, Globe, CreditCard, X, ChevronRight } from 'lucide-react';
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
      'Local & Global Payment Options'
    ],
    buttonText: 'Start Writing',
    action: 'subscribe',
    highlight: true,
    icon: <PenTool className="w-6 h-6" />
  }
];

const paymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Direct mobile money transfer (Kenya)',
    icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
    tag: 'Popular in Kenya'
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Cards, Mobile Money & Virtual Cards',
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    tag: 'Africa & Global'
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Secure card & bank payments',
    icon: <CreditCard className="w-5 h-5 text-yellow-500" />,
    tag: 'Fast & Secure'
  },
  {
    id: 'stripe',
    name: 'Stripe (International)',
    description: 'Global credit & debit cards',
    icon: <Globe className="w-5 h-5 text-purple-400" />,
    tag: 'International'
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleAction = async (plan: any) => {
    if (plan.action === 'signup') {
      router.push('/signup');
      return;
    }

    if (!user) {
      router.push('/signup?plan=writer');
      return;
    }

    // Instead of immediate redirect, show options
    setShowPaymentOptions(true);
  };

  const handlePaymentMethod = async (methodId: string) => {
    setLoading(methodId);
    // Placeholder for actual gateway integration
    // For now, it just simulates the "intent"
    console.log(`Selected payment method: ${methodId}`);
    
    // If Stripe is picked, we use existing logic
    if (methodId === 'stripe') {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, userEmail: user?.email }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        alert('Stripe gateway currently unavailable.');
      }
    } else {
      // Logic for M-Pesa, Flutterwave, etc will go here
      alert(`${methodId} integration is being initialized for your region.`);
    }
    setLoading(null);
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
            Choose your path. Accessible globally, powered locally.
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
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--text)]/10 text-[var(--text)]/40'}`}>
                    {plan.icon || <Star className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-light text-[var(--text)] uppercase tracking-[0.2em]">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-6xl font-light text-[var(--text)]">{plan.price}</span>
                  {plan.period && <span className="text-[var(--text)]/40 text-sm uppercase tracking-[0.3em] ml-2">{plan.period}</span>}
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
                className={`w-full py-5 rounded-2xl text-center uppercase tracking-[0.3em] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-[var(--accent)] text-[var(--bg)] hover:shadow-2xl hover:scale-[1.02]'
                    : 'bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10 hover:bg-[var(--text)]/10'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Payment Selection Overlay */}
        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[var(--bg)] border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative shadow-3xl"
              >
                <button 
                  onClick={() => setShowPaymentOptions(false)}
                  className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                  <h2 className="text-3xl font-light text-white mb-2 uppercase tracking-widest">Select Gateway</h2>
                  <p className="text-white/40 text-xs italic">Choose your preferred method to enter the sanctuary.</p>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethod(method.id)}
                      disabled={!!loading}
                      className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/30 hover:bg-white/[0.05] transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                          {method.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-white font-medium">{method.name}</h4>
                            <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/40 font-bold">{method.tag}</span>
                          </div>
                          <p className="text-[10px] text-white/30 font-light mt-1">{method.description}</p>
                        </div>
                      </div>
                      {loading === method.id ? <Loader2 className="w-4 h-4 animate-spin text-white/20" /> : <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />}
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-center text-[9px] text-white/20 uppercase tracking-[0.3em]">
                  Secure encrypted transmission
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
