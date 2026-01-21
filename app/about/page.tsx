'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/app/components/AnimatedCounter';

export default function AboutPage() {
  const stats = [
    { label: 'Essays Published', value: 12 },
    { label: 'Active Readers', value: 1500 },
    { label: 'Reflections Captured', value: 3400 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-5xl mb-2 font-light tracking-wide">About</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[2px] w-24 bg-gradient-to-r from-amber-400 to-rose-400 mb-12"
        />

        {/* Main content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">The Sacred Digital Space</h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-amber-600 dark:text-amber-400">lifewithmystic</span> is a contemplative sanctuary for deep, philosophical writing and spiritual exploration. In a world of endless noise, we've created a space for silence—the kind that speaks.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Our Purpose</h3>
            <p className="text-gray-700 dark:text-gray-300">
              This project explores the intersection of consciousness, technology, and the sacred. Through essays, reflections, and visual meditations, we seek to:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>🌙 Cultivate space for contemplation in digital form</li>
              <li>✨ Bridge ancient wisdom with modern experience</li>
              <li>🤝 Build a community of conscious seekers</li>
              <li>📚 Archive insights and reflections for future discovery</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Interactive Features</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Every essay is designed for immersive reading. Highlight passages to add personal reflections, explore connected ideas in our Knowledge Graph, and discover related writings through our intelligent search.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-y border-amber-300/20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -8 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50/10 to-purple-50/10 dark:from-amber-950/10 dark:to-purple-950/10 border border-amber-300/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: 'spring', delay: i * 0.1 }}
                  className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2"
                >
                  <AnimatedCounter end={stat.value} duration={2} suffix="+" />
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">Design Philosophy</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Inspired by both zen aesthetics and academic contemplation, lifewithmystic offers two reading modes. The <span className="font-semibold">Zen theme</span> evokes rice paper scrolls and natural simplicity, while the <span className="font-semibold">Academia theme</span> channels the quietness of libraries and midnight study. Switch anytime to match your contemplative mood.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-12 p-8 rounded-lg bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-300/30 text-center"
          >
            <h3 className="text-2xl font-semibold mb-3">Ready to explore?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Begin your journey through essays, start your personal reflections, or discover connections in our knowledge graph.
            </p>
            <motion.div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Read Essays', href: '/blog' },
                { label: 'Knowledge Graph', href: '/knowledge-graph' },
                { label: 'Start Reflecting', href: '/reflections' },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full bg-amber-500 hover:bg-rose-500 text-white font-semibold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}

