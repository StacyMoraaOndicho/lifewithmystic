import { createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oapgv793';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || 'production',
});

export function urlFor(source: any) {
  return builder.image(source);
}

export type PortableBlock = any;

export type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  body?: PortableBlock[];
};

declare global {
  var __LWM_FALLBACK_POSTS__: SanityPost[] | undefined;
}

const getFallbackPosts = (): SanityPost[] => {
  if (typeof window === 'undefined') {
    if (!global.__LWM_FALLBACK_POSTS__) {
      global.__LWM_FALLBACK_POSTS__ = [
        {
          _id: '1',
          title: 'Silence as Mirror (Fallback)',
          slug: { current: 'silence-as-mirror' },
          publishedAt: '2025-01-20',
          excerpt: 'Exploring the depths of silence in spiritual practice.',
          body: [{ _type: 'block', children: [{ _type: 'span', text: 'Fallback content...' }] }],
        },
      ];
    }
    return global.__LWM_FALLBACK_POSTS__;
  }
  return [];
};

export function addFallbackPost(post: SanityPost) {
  const posts = getFallbackPosts();
  posts.unshift(post);
  return posts;
}

export function updateFallbackPost(id: string, data: Partial<SanityPost>) {
  const posts = getFallbackPosts();
  const index = posts.findIndex(p => p._id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...data };
    return posts[index];
  }
  return null;
}

export function deleteFallbackPost(id: string) {
  const posts = getFallbackPosts();
  const index = posts.findIndex(p => p._id === id);
  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
  return false;
}

export async function sanityFetch<G = any>(query: string, params: Record<string, any> = {}): Promise<G> {
  if (projectId && projectId !== 'none') {
    try {
      return await client.fetch(query, params, { cache: 'no-store' });
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to local data:", error);
    }
  }

  if (query.includes('_type == "post"')) {
    const posts = getFallbackPosts();
    return posts as any;
  }

  return [] as any;
}

export default sanityFetch;
