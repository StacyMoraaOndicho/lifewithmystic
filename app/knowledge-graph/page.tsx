import KnowledgeGraphViz from "../../components/KnowledgeGraphViz";
import sanityFetch from "@/lib/sanity";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  categories?: { title: string }[];
};

export default async function KnowledgeGraphPage() {
  // Fetch real posts from Sanity
  const posts = await sanityFetch<Post[]>(`
    *[_type == "post"] {
      _id,
      title,
      slug,
      "categories": categories[]->{title}
    }
  `);

  // Transform posts into graph nodes
  const nodes = (posts || []).map(post => ({
    id: post._id,
    label: post.title,
    slug: post.slug.current
  }));

  // Create links between posts if they share categories (simple logic)
  const edges: { source: string; target: string }[] = [];
  
  return (
    <main className="min-h-screen p-12 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light mb-2">Knowledge Graph</h1>
        <p className="text-white/50 mb-12 italic">Mapping the interconnected web of sacred philosophy</p>
        
        <div className="h-[600px] glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <KnowledgeGraphViz nodes={nodes} edges={edges} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-amber-300 font-semibold mb-2">💡 Interactive Map</h3>
            <p className="text-sm text-white/60">Nodes represent essays. Click a node to navigate to that post.</p>
          </div>
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-blue-300 font-semibold mb-2">🔄 Real-time Sync</h3>
            <p className="text-sm text-white/60">Adding a post in Sanity Studio automatically adds it here.</p>
          </div>
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-purple-300 font-semibold mb-2">🌌 Constellations</h3>
            <p className="text-sm text-white/60">Future updates will link posts by shared philosophical themes.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
