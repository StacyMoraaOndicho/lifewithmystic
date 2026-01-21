'use client';

import { useState } from 'react';

const samplePosts = [
  {
    title: 'The Art of Silence',
    slug: 'the-art-of-silence',
    excerpt: 'In a world of constant noise, silence becomes a rare and precious gift. Discover how embracing stillness can transform your inner world.',
    body: `# The Art of Silence

In our modern age, silence has become increasingly rare. We are surrounded by notifications, music, conversations, and endless streams of information. Yet, there exists a profound wisdom in the art of silence.

## Finding Peace in Stillness

Silence is not merely the absence of sound. It is a presence—a space where our true thoughts can emerge. When we sit in silence, we create room for reflection, creativity, and genuine understanding of ourselves.

## The Practice

Begin with just five minutes each day. Find a quiet space, sit comfortably, and allow yourself to simply be. Notice the subtle sounds around you—the rustling of leaves, the breath moving through your body. Let thoughts pass like clouds in the sky.

## The Transformation

Through consistent practice, you'll find that silence becomes your sanctuary. Problems that seemed overwhelming suddenly appear manageable. Relationships deepen as you learn to listen more deeply. Creativity flourishes in the fertile space of quiet contemplation.

Silence is not a luxury for monks and hermits—it is a necessity for all of us seeking meaning in this world.`,
    categories: ['Meditation', 'Philosophy'],
    tags: ['silence', 'mindfulness', 'peace'],
  },
  {
    title: 'Consciousness and the Self',
    slug: 'consciousness-and-the-self',
    excerpt: 'What is consciousness? Explore the nature of the self and how our understanding shapes our reality.',
    body: `# Consciousness and the Self

The question of consciousness remains one of philosophy's deepest mysteries. What is the "I" that observes? What is the "self" that experiences?

## The Nature of Consciousness

Consciousness is the light by which we perceive existence. It is not merely thought—it is the awareness of thought. Not merely sensation—it is the awareness of sensation.

## The Illusion of Self

Many spiritual traditions point to a startling realization: the self we cling to is largely an illusion. The ego constructs a narrative of a separate "I," yet deeper investigation reveals something more fluid and interconnected.

## Awakening to Reality

When we begin to question the nature of our consciousness, we embark on a journey toward liberation. We start to see through the mechanisms of ego and mind. We glimpse the luminous awareness that lies beneath all experience.

This awakening is not an escape from life—it is a fuller participation in it, freed from the limitations of our constructed self.`,
    categories: ['Philosophy', 'Consciousness'],
    tags: ['consciousness', 'self', 'awareness', 'spirituality'],
  },
  {
    title: 'The Journey of Self-Discovery',
    slug: 'the-journey-of-self-discovery',
    excerpt: 'Life is a sacred journey of self-discovery. Learn how to navigate the path with intention and grace.',
    body: `# The Journey of Self-Discovery

Every life is a journey. The question is: are we navigating it consciously or drifting without direction?

## The Awakening

Self-discovery begins with a simple acknowledgment: "I do not know myself as well as I thought I did." This humility opens the door to genuine growth.

## The Exploration

As we embark on this inner journey, we encounter various landscapes:
- Our wounds and where they came from
- Our gifts and how to share them
- Our fears and how they shape us
- Our potential and how to manifest it

## The Integration

True self-discovery is not about collecting experiences or accumulating knowledge. It is about integration—weaving all parts of ourselves into a coherent whole.

## The Destination

The journey never truly ends, for we are always becoming. Yet in each moment of conscious awareness, we arrive at our destination: the full presence of who we truly are.`,
    categories: ['Philosophy', 'Personal Growth'],
    tags: ['self-discovery', 'growth', 'journey', 'spirituality'],
  },
];

export default function CreateSampleContent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createPosts = async () => {
    setLoading(true);
    try {
      for (const post of samplePosts) {
        const response = await fetch('/api/posts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            publishedAt: new Date().toISOString(),
            status: 'published',
            categories: post.categories,
            tags: post.tags,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create post: ${post.title}`);
        }
      }
      setMessage('✅ Sample posts created successfully!');
    } catch (err) {
      setMessage(`❌ Error: ${err}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Sample Content</h1>
      <p className="mb-6 opacity-70">Create 3 sample philosophical blog posts to test your platform.</p>
      
      <button
        onClick={createPosts}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Sample Posts'}
      </button>

      {message && <p className="mt-4 p-4 bg-blue-500/20 rounded">{message}</p>}
    </div>
  );
}
