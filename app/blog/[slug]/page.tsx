import sanityFetch from "../../../lib/sanity";
import { notFound } from "next/navigation";
import ParagraphReflection from "../../../components/ParagraphReflection";
import { PortableText } from '@portabletext/react';
import { ImmersiveToggle } from "@/app/components/ImmersiveToggle";
import { MarginReflections } from "@/app/components/MarginReflections";

type PortableBlock = any;

type Post = {
  title: string;
  slug: { current: string };
  publishedAt?: string;
  body?: PortableBlock[];
  excerpt?: string;
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let post: Post | undefined;
  try {
    const res = await sanityFetch<Post[]>(`*[_type == "post" && slug.current == $slug] { title, slug, publishedAt, body, excerpt }`, { slug });
    post = res?.[0];
  } catch (err) {
    console.error(err);
  }

  if (!post) return notFound();

  return (
    <main className="min-h-screen p-12">
      <ImmersiveToggle />
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-4">{post.title}</h1>
        <p className="text-sm italic opacity-70 mb-6">{post.excerpt}</p>

        {/* Portable Text rendering */}
        <section className="prose dark:prose-invert max-w-none">
          {Array.isArray(post.body) && post.body.length > 0 ? (
            <PortableText value={post.body} />
          ) : (
            <p>No content.</p>
          )}
        </section>
      </article>
      <MarginReflections reflections={[]} />
    </main>
  );
}
