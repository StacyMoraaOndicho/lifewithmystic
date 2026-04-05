'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

type Writer = {
  _id: string;
  name: string;
  bio?: string;
  image?: any;
};

export default function WriterCard({ writer }: { writer: Writer }) {
  return (
    <div className="flex justify-center md:justify-start">
      {/* Increased width slightly by ~1% (from 260px to 263px) */}
      <Link key={writer._id} href={`/writer/${writer._id}`} className="group block w-full max-w-[263px]">
        <div className="p-6 rounded-[32px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02] group-hover:bg-[var(--text)]/[0.04] group-hover:border-[var(--accent)]/30 transition-all flex flex-col items-center text-center shadow-lg hover:shadow-[var(--accent)]/5 h-auto">
          
          {/* Small Glowing Rotating Avatar Display */}
          <div className="relative w-12 h-12 mb-4 flex items-center justify-center shrink-0">
            
            <motion.div
              animate={{ 
                rotate: 360,
                boxShadow: [
                  "0 0 6px rgba(255,255,255,0.3)",
                  "0 0 15px rgba(255,255,255,0.6)",
                  "0 0 6px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 rounded-full border-2 border-white/40 z-0"
            />

            <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center overflow-hidden relative z-10">
              {writer.image ? (
                <img 
                  src={urlFor(writer.image).width(150).height(150).url()} 
                  alt={writer.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 opacity-20" />
              )}
            </div>
          </div>

          <h3 className="text-lg font-light mb-1 group-hover:text-[var(--accent)] transition-colors tracking-wide">{writer.name}</h3>
          
          {/* Bio - Increased margin slightly (~0.5% more perceived space) */}
          <p className="text-[10px] text-[var(--text)]/60 italic mb-[17px] leading-relaxed line-clamp-2 px-2">
            {writer.bio || "A contributor exploring the intersections of silence and wisdom."}
          </p>
          
          <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-bold text-[var(--text)] opacity-40 group-hover:opacity-100 transition-all">
            ENTER SANCTUARY <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
