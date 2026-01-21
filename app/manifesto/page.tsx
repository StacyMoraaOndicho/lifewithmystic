'use client';

import { motion } from 'framer-motion';

const manifesto = `In the beginning, there was silence—not the absence of sound, but the presence of infinite potential.

We live in an age of acceleration, where information floods without wisdom, and connection masks isolation. Yet within this digital chaos, a hunger persists: the yearning for depth, for meaning, for the sacred that dwells beneath the surface of everyday experience.

lifewithmystic is a response to this hunger.

This is a space dedicated to contemplation—not as escapism, but as engagement with reality at its deepest level. We believe that philosophy, spirituality, and poetry are not luxuries or indulgences, but essential practices for consciousness itself. To examine our assumptions, to sit with uncertainty, to listen to the silence within: these are revolutionary acts in a world demanding constant noise.

Here, we explore the intersection of consciousness and technology. We ask not what the machine can do for us, but what it can reveal about ourselves. The same medium that fragments attention can, if approached with intention, become a portal for reflection and discovery.

Three principles guide this space:

First: Authenticity over polish. We value honest exploration over perfect presentation. Thoughts need not be final to be worth sharing.

Second: Community through resonance. Rather than algorithms designed to divide, we build connection through shared inquiry. When you highlight a passage and reflect upon it, you join a conversation spanning time and consciousness.

Third: The sacred in the ordinary. We do not separate the mystical from the material. The divine is not elsewhere—it breathes within the present moment, within the text you're reading, within your own awareness reading it.

What you'll find here:

Essays that slow you down. Writing that breathes rather than rushes. Work that trusts your intelligence and invites deep engagement.

A Knowledge Graph that reveals connections—not through algorithm, but through genuine intellectual and spiritual kinship. Each node a thought. Each link a bridge between ideas.

A Reflections system where your reading becomes dialogue. Highlight a passage. Add your thought. Become part of the collective contemplation.

Two reading modes: Zen and Academia. One echoes the serenity of ancient scrolls. The other recalls the quiet intensity of the scholar's lamp. Choose what serves your presence in the moment.

This project represents a belief: that technology, wielded with intention, can deepen our humanity rather than diminish it. That a website can be a sanctuary. That in an age of infinite content, what we truly need is depth.

Welcome to lifewithmystic.

Seek the silence that speaks.`;

const lines = manifesto.split('\n').filter(line => line.trim());

export default function ManifestoPage() {
  return (
    <main className="min-h-screen p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-5xl mb-2 font-light tracking-wide">Manifesto</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[2px] w-24 bg-gradient-to-r from-rose-400 to-purple-400 mb-12"
        />

        {/* Content */}
        <motion.div
          className="space-y-6 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.3 }}
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                ${line.trim() === '' ? 'h-4' : ''}
                ${line.match(/^(First:|Second:|Third:)/) ? 'font-semibold text-amber-600 dark:text-amber-400 text-xl my-6' : ''}
                ${line.startsWith('•') || line.startsWith('-') ? 'ml-6 text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200'}
                ${line.includes('lifewithmystic') ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}
              `}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 pt-12 border-t border-amber-300/20 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Ready to begin your journey?
          </p>
          <motion.div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'Read Essays', href: '/blog' },
              { label: 'Start Reflecting', href: '/reflections' },
              { label: 'Explore Knowledge', href: '/knowledge-graph' },
            ].map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-amber-300/50 hover:bg-amber-500/10 transition-colors font-semibold"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}

