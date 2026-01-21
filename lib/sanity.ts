// Simple helper to query Sanity's read API without adding the Sanity client dependency.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

async function sanityFetch<G = any>(query: string, params?: Record<string, any>): Promise<G> {
  if (!projectId) {
    // Return sample data when Sanity is not configured
    if (query.includes('_type == "post"')) {
      return [
        { _id: '1', title: 'Silence as Mirror', slug: { current: 'silence-as-mirror' }, publishedAt: '2025-01-20', excerpt: 'Exploring the depths of silence in spiritual practice.' },
        { _id: '2', title: 'The Divine Within', slug: { current: 'divine-within' }, publishedAt: '2025-01-18', excerpt: 'Reflections on finding the sacred in everyday moments.' },
      ] as any;
    }
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  }

  const base = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`;
  const url = params
    ? `${base}?query=${encodeURIComponent(query)}&${new URLSearchParams({ params: JSON.stringify(params) })}`
    : `${base}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sanity fetch failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return json.result as G;
}

export default sanityFetch;
