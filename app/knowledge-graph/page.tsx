import KnowledgeGraphViz from "../../components/KnowledgeGraphViz";

const sampleNodes = [
  { id: '1', label: 'Silence', slug: 'silence' },
  { id: '2', label: 'God', slug: 'god' },
  { id: '3', label: 'Meditation', slug: 'meditation' },
];

export default function KnowledgeGraphPage() {
  return (
    <main className="min-h-screen p-12">
      <h2 className="text-3xl mb-6">Knowledge Graph</h2>
      <KnowledgeGraphViz nodes={sampleNodes} edges={[]} />
    </main>
  );
}

