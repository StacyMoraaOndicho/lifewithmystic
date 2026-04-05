'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string; // We'll join this later or use a simple display
};

export default function Comments({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (!error) setComments(data || []);
      setLoading(false);
    }

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSending(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setComments([data, ...comments]);
      setNewComment('');
    }
    setSending(false);
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id).eq('user_id', user?.id);
    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <section className="mt-20 pt-12 border-t border-[var(--text)]/10">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="w-6 h-6 text-[var(--accent)]" />
        <h3 className="text-2xl font-light tracking-widest uppercase">Reflections</h3>
        <span className="px-2 py-0.5 rounded-full bg-[var(--text)]/5 text-[var(--text)]/40 text-xs font-mono">{comments.length}</span>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex flex-col gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your reflection..."
              className="w-full p-6 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light resize-none min-h-[120px]"
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[var(--text)]/40 font-mono uppercase tracking-[0.2em]">Logged in as {user.email?.split('@')[0]}</p>
              <button
                type="submit"
                disabled={sending || !newComment.trim()}
                className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all font-semibold uppercase tracking-widest text-xs disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? 'Whispering...' : 'Send Reflection'}
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-10 bg-[var(--text)]/5 rounded-3xl border border-[var(--text)]/10 text-center mb-12">
          <p className="text-[var(--text)]/40 mb-6 italic font-light">Join the sacred circle to share your reflections.</p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="px-8 py-3 bg-[var(--text)]/10 text-[var(--text)] rounded-full hover:bg-[var(--text)]/20 transition-all text-sm uppercase tracking-widest">Login</a>
            <a href="/signup" className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full hover:shadow-lg transition-all text-sm uppercase tracking-widest font-semibold">Join</a>
          </div>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-8">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 rounded-2xl border border-[var(--text)]/5 bg-[var(--text)]/[0.02] relative group hover:bg-[var(--text)]/[0.04] transition-colors duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] font-mono text-[var(--text)]/60">Anonymous Seeker</p>
                    <p className="text-[10px] text-[var(--text)]/30 font-mono italic">
                      {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                {user && user.id === comment.user_id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-2 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="text-[var(--text)]/80 leading-relaxed font-light whitespace-pre-wrap pl-1">
                {comment.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && comments.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[var(--text)]/5 rounded-3xl">
            <p className="text-[var(--text)]/20 uppercase tracking-[0.5em] text-xs font-mono">Stillness</p>
            <p className="text-[var(--text)]/30 mt-2 italic text-sm font-light">No reflections shared yet...</p>
          </div>
        )}
      </div>
    </section>
  );
}
