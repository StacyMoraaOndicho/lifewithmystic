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

// Helper to generate image URLs using the updated builder method
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

export async function sanityFetch<G = any>(query: string, params: Record<string, any> = {}): Promise<G> {
  if (projectId && projectId !== 'none') {
    try {
      return await client.fetch(query, params);
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to local data:", error);
    }
  }

  if (query.includes('_type == "post"')) {
    const posts = getFallbackPosts();
    if (query.includes('slug.current == $slug') && params?.slug) {
      const post = posts.find((p) => p.slug.current === params.slug);
      return (post ? [post] : []) as any;
    }
    return posts as any;
  }

  return [] as any;
}

export default sanityFetch;
