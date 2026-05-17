'use client';

import sanityFetch from "../../lib/sanity";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type PostPreview = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
  excerpt?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<PostPreview[]>(
          `*[_type == "post"] | order(publishedAt desc) { _id, title, slug, publishedAt, _createdAt, excerpt }`
        );
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getRelativeTime = (date?: string) => {
    if (!date) return '';
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <main className="min-h-screen p-12 bg-[#0a0a0a] text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto pt-16"
      >
        <h1 className="text-5xl mb-2 font-light tracking-wide uppercase">Essays & Writings</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[2px] w-24 bg-gradient-to-r from-amber-400 to-rose-400 mb-8"
        />
        
        {loading ? (
          <div className="text-center py-20 opacity-20 animate-pulse uppercase tracking-widest text-xs">
            Synchronizing Sanctuary...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-white/20 uppercase tracking-widest text-xs">
            No essays found.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug.current}`}>
                  <motion.div
                    whileHover={{ translateX: 8 }}
                    className="group p-8 rounded-2xl border border-white/5 hover:border-amber-300/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-light mb-3 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                          {post.title}
                        </h2>
                        <p className="text-white/60 mb-4 line-clamp-2 italic font-light">
                          {post.excerpt || 'Click to read this reflection...'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold">
                          <span className="text-amber-500">
                            {formatDate(post.publishedAt || post._createdAt)}
                          </span>
                          <span className="opacity-30">
                            {getRelativeTime(post.publishedAt || post._createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xl opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">→</div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
