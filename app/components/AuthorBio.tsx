'use client';

import { motion } from 'framer-motion';

interface AuthorBioProps {
  name?: string;
  bio?: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export function AuthorBio({ name = 'Life with Mystic', bio = 'Exploring philosophy, spirituality, and sacred digital spaces.', social }: AuthorBioProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass-light p-6 rounded-lg my-12 border-l-4 border-amber-400"
    >
      <div className="flex gap-4">
        <div className="text-4xl">✍️</div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-2">About the Author</h4>
          <p className="text-white/80 text-sm mb-4">{bio}</p>
          <p className="font-semibold text-white mb-3">— {name}</p>
          
          {social && (
            <div className="flex gap-3">
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-blue-400 transition-colors"
                  title="Twitter"
                >
                  𝕏
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                >
                  💼
                </a>
              )}
              {social.website && (
                <a
                  href={social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-amber-400 transition-colors"
                  title="Website"
                >
                  🌐
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
