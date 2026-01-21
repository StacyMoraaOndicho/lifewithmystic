'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Comment {
  _id: string;
  name: string;
  text: string;
  _createdAt: string;
}

interface CommentsProps {
  postId: string;
  allowComments?: boolean;
}

export function Comments({ postId, allowComments = true }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowComments) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, name, email, text }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Comment submitted for review!' });
        setName('');
        setEmail('');
        setText('');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to post comment' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <h3 className="text-2xl font-light text-white mb-6">Comments</h3>

      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-white">{comment.name}</p>
                <p className="text-xs text-white/50">
                  {new Date(comment._createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-white/80">{comment.text}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      {allowComments && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass p-6 rounded-lg space-y-4"
        >
          <p className="text-white/70 text-sm">Leave a thoughtful response</p>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-200 border border-green-500/50'
                  : 'bg-red-500/20 text-red-200 border border-red-500/50'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="glass rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:glass-light"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="glass rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:glass-light"
              required
            />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your thoughtful comment..."
            className="w-full glass rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:glass-light resize-none h-24"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-rose-400 text-black font-semibold rounded-lg hover:from-amber-300 hover:to-rose-300 disabled:opacity-50 transition-all"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>

          <p className="text-xs text-white/50">
            Comments are moderated and will appear after approval.
          </p>
        </motion.form>
      )}
    </section>
  );
}
