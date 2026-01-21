/**
 * Extended Sanity Schema with all new fields
 * This defines the structure for posts with all new features
 */

export const postSchema = {
  _type: 'post',
  _id: 'post-schema',
  fields: {
    title: 'string',
    slug: 'slug',
    excerpt: 'string',
    body: 'array', // Portable Text
    publishedAt: 'date',
    status: 'enum(draft, published, scheduled)', // NEW: Draft mode
    scheduledFor: 'datetime', // NEW: Scheduled publishing
    image: 'image', // NEW: Featured image
    categories: 'array', // NEW: Categories
    tags: 'array', // NEW: Tags
    author: 'reference', // Author bio
    readTime: 'number', // Auto-calculated
    views: 'number', // Analytics
    likes: 'number', // Engagement
    bookmarks: 'number', // Bookmark tracking
    podcastUrl: 'url', // Podcast integration
    relatedPosts: 'array', // Related posts
    allowComments: 'boolean', // Comments control
    collection: 'reference', // Post collections
  },
};

export type PostType = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: any[];
  publishedAt?: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string;
  image?: { asset: { _ref: string; url: string } };
  categories?: string[];
  tags?: string[];
  author?: { name: string; bio: string };
  readTime?: number;
  views?: number;
  likes?: number;
  bookmarks?: number;
  podcastUrl?: string;
  relatedPosts?: any[];
  allowComments?: boolean;
  collection?: any;
};
