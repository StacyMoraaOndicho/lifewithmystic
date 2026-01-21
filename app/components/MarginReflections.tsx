'use client';

import { useImmersiveMode } from '@/lib/immersive-context';
import { motion } from 'framer-motion';

interface Reflection {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

interface MarginReflectionsProps {
  reflections: Reflection[];
}

export function MarginReflections({ reflections }: MarginReflectionsProps) {
  const { isImmersive } = useImmersiveMode();

  if (isImmersive) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="hidden lg:block fixed right-6 top-32 w-72 max-h-96 overflow-y-auto"
    >
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-amber-700/60 dark:text-amber-300/60 font-semibold">
          Reflections
        </h3>
        {reflections.map((ref) => (
          <motion.div
            key={ref.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-l-2 border-amber-300/40 text-xs text-amber-900/70 dark:text-amber-200/70 rounded-sm"
          >
            <p className="italic mb-1">{ref.text}</p>
            <p className="text-xs text-amber-700/50 dark:text-amber-300/50">— {ref.user}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
