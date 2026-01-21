'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import sanityFetch from '@/lib/sanity';

type RelatedPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt?: string;
};

export function RelatedPosts({ currentSlug, categories }: { currentSlug: string; categories?: string[] }) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const query = categories && categories.length > 0
          ? `*[_type == "post" && slug.current != "${currentSlug}" && categories[] in [${categories.map(c => `"${c}"`).join(', ')}]] | order(publishedAt desc)[0:3]`
          : `*[_type == "post" && slug.current != "${currentSlug}"] | order(publishedAt desc)[0:3]`;

        const data = await sanityFetch<RelatedPost[]>(query);
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch related posts:', err);
      }
    }

    fetchRelated();
  }, [currentSlug, categories]);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <h3 className="text-2xl font-light mb-6 text-white">Related Essays</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {posts.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 rounded-lg hover:glass-light transition-all"
          >
            <Link href={`/blog/${post.slug.current}`}>
              <h4 className="font-semibold text-white hover:text-amber-300 transition-colors mb-2">
                {post.title}
              </h4>
              <p className="text-sm text-white/70 line-clamp-2">{post.excerpt}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
