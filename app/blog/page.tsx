'use client';

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Calendar } from "lucide-react";

type PostPreview = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  profiles?: any;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, slug, published_at, excerpt,
          profiles ( username )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto pt-24">
        <header className="mb-20 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-light tracking-tight uppercase mb-4"
          >
            Essays
          </motion.h1>
          <p className="text-white/40 italic text-lg leading-relaxed">A sanctuary for shared wisdom and silent reflections.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-20">Synchronizing Sanctuary...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post, idx) => {
              const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[var(--accent)]/30 transition-all duration-500 shadow-xl">
                      <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                          <h2 className="text-3xl font-light leading-tight group-hover:text-[var(--accent)] transition-colors uppercase">
                            {post.title}
                          </h2>
                          <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-[var(--accent)] group-hover:translate-x-2 transition-all" />
                        </div>
                        <p className="text-white/50 leading-relaxed italic font-light line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-8 pt-4 border-t border-white/5 mt-4">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                            <Calendar className="w-3 h-3" /> {formatDate(post.published_at)}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">
                            By {author?.username || 'Architect'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
