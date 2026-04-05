'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Twitter, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Props = {
  postId: string;
  title: string;
  url: string;
};

export default function PostInteractions({ postId, title, url }: Props) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
  };

  useEffect(() => {
    async function fetchLikes() {
      // 1. Get total likes count
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (!countError) setLikesCount(count || 0);

      // 2. Check if current user liked it
      if (user) {
        const { data, error: userLikeError } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!userLikeError && data) setLiked(true);
      }
      
      setLoading(false);
    }

    fetchLikes();
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) {
      alert('Please log in to like this post.');
      return;
    }

    const previousLiked = liked;
    const previousCount = likesCount;

    // Optimistic update
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    if (liked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) {
        setLiked(previousLiked);
        setLikesCount(previousCount);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) {
        setLiked(previousLiked);
        setLikesCount(previousCount);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-6 py-8 border-y border-[var(--text)]/10 my-12 transition-colors duration-500">
      {/* Like Button */}
      <button 
        onClick={toggleLike}
        disabled={loading}
        className="flex items-center gap-3 group transition-all"
      >
        <div className={`p-3 rounded-full transition-all ${liked ? 'bg-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-[var(--text)]/5 text-[var(--text)]/40 group-hover:bg-[var(--text)]/10 group-hover:text-[var(--text)]'}`}>
          <Heart className={`w-6 h-6 transition-transform duration-300 ${liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
        </div>
        <div className="flex flex-col items-start">
          <span className={`text-sm font-semibold ${liked ? 'text-rose-400' : 'text-[var(--text)]/40'}`}>
            {likesCount} {likesCount === 1 ? 'Soul' : 'Souls'} liked this
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[var(--text)]/20">Expression of Resonance</span>
        </div>
      </button>

      <div className="flex-1 h-[1px] bg-[var(--text)]/5 hidden md:block" />

      {/* Share Buttons */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-[var(--text)]/30 uppercase tracking-[0.3em] font-mono mr-2">Circulate:</span>
        
        {/* X (Twitter) */}
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--text)]/5 text-[var(--text)]/40 hover:bg-sky-500/10 hover:text-sky-400 transition-all border border-transparent hover:border-sky-500/20">
          <Twitter className="w-5 h-5" />
        </a>

        {/* WhatsApp */}
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[var(--text)]/5 text-[var(--text)]/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20">
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Generic Share */}
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title, url: fullUrl });
            } else {
              navigator.clipboard.writeText(fullUrl);
              alert('Link copied to clipboard!');
            }
          }}
          className="p-3 rounded-full bg-[var(--text)]/5 text-[var(--text)]/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-all border border-transparent hover:border-[var(--accent)]/20"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
