import sanityFetch from "@/lib/sanity";
import Link from "next/link";
import WriterCard from "@/components/WriterCard";

type Author = {
  _id: string;
  name: string;
  bio?: string;
  image?: any;
};

export default async function WritersGallery() {
  const writers = await sanityFetch<Author[]>(`*[_type == "author"] { _id, name, bio, image }`);

  return (
    <main className="min-h-screen p-12 bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-20">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-light mb-6 tracking-tight">The <span className="italic text-[var(--accent)]">Sanctuary</span> of Voices</h1>
          <p className="text-[var(--text)]/50 max-w-2xl mx-auto italic font-light leading-relaxed">
            Discover the philosophers, seekers, and storytellers who breathe life into these digital pages.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {writers.map((writer) => (
            <WriterCard key={writer._id} writer={writer} />
          ))}
        </div>

        {writers.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-[var(--text)]/5 rounded-3xl">
            <p className="text-[var(--text)]/30 italic">The sanctuary is currently silent. Be the first to share your voice.</p>
            <Link href="/pricing" className="mt-6 inline-block text-[var(--accent)] font-bold hover:underline">Become a Writer →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
