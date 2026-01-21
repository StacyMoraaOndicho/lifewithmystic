"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Node = { id: string; label: string; slug?: string };
type Edge = { source: string; target: string };

export default function KnowledgeGraphViz({ nodes = [], edges = [] }: { nodes?: Node[]; edges?: Edge[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // simple layout: place nodes in a circle
    const svg = svgRef.current!;
    const w = svg.clientWidth || 800;
    const h = svg.clientHeight || 600;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 3;
    nodes.forEach((n, i) => {
      const el = svg.querySelector(`#node-${n.id}`) as any;
      if (!el) return;
      const angle = (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      el.setAttribute('cx', x);
      el.setAttribute('cy', y);
      const label = svg.querySelector(`#label-${n.id}`) as any;
      if (label) { label.setAttribute('x', x); label.setAttribute('y', y + 28); }
    });
  }, [nodes]);

  return (
    <svg ref={svgRef} className="w-full h-96 border rounded" viewBox="0 0 800 600">
      {edges.map((e, i) => (
        <line key={i} x1={400} y1={300} x2={420} y2={320} stroke="rgba(200,200,200,0.4)" strokeWidth={1} />
      ))}
      {nodes.map((n) => (
        <g key={n.id} onClick={() => n.slug && router.push(`/blog/${n.slug}`)} style={{ cursor: n.slug ? 'pointer' : 'default' }}>
          <circle id={`node-${n.id}`} r={26} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
          <text id={`label-${n.id}`} textAnchor="middle" fontSize={12} fill="#fff">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}
