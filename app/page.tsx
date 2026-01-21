"use client";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import RecentPosts from "./components/RecentPosts";

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-1000 
      bg-zen-bg text-zen-text dark:bg-academia-bg dark:text-academia-text">
      
      <ThemeToggle />

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-10 py-20 md:py-0 font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 tracking-widest uppercase font-light">
            lifewithmystic
          </h1>
          <div className="h-[1px] w-20 md:w-24 bg-current mx-auto my-6 md:my-8 opacity-30" />
          <motion.p 
            className="text-base md:text-lg italic opacity-80 px-4"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            "Seek the silence that speaks."
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-5 md:bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-xs opacity-50">scroll</div>
        </motion.div>
      </div>

      {/* Recent Posts Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
        <RecentPosts />
      </section>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent my-12"
      />

      {/* Call to action */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-light tracking-wide">Explore the sacred digital space</h2>
          <motion.div
            className="flex flex-wrap gap-4 justify-center text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              { label: 'Essays', href: '/blog' },
              { label: 'Reflections', href: '/reflections' },
              { label: 'Knowledge Graph', href: '/knowledge-graph' },
              { label: 'About', href: '/about' },
            ].map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ scale: 1.1, color: '#D4AF98' }}
                className="px-4 py-2 border border-amber-300/30 rounded-full hover:border-amber-300/60 transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}