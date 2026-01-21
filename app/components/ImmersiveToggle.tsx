'use client';

import { useImmersiveMode } from '@/lib/immersive-context';
import { motion } from 'framer-motion';

export function ImmersiveToggle() {
  const { isImmersive, toggle } = useImmersiveMode();

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 px-3 py-1 text-sm rounded-full bg-black/20 dark:bg-white/20 text-white/80 hover:text-white/100 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isImmersive ? 'Exit Immersive' : 'Enter Immersive'}
    >
      {isImmersive ? '⛔ Focus' : '👁️ Focus'}
    </motion.button>
  );
}
