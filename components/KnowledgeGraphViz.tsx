"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Node = { id: string; label: string; slug?: string };
type Edge = { source: string; target: string };

export default function KnowledgeGraphViz({ nodes = [], edges = [] }: { nodes?: Node[]; edges?: Edge[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        setDimensions({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 3;

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full bg-transparent transition-colors duration-500" 
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Dynamic Edges (Lines between nodes) */}
      {nodes.length > 1 && nodes.map((_, i) => {
        if (i === nodes.length - 1) return null;
        const angle1 = (i / nodes.length) * Math.PI * 2;
        const angle2 = ((i + 1) / nodes.length) * Math.PI * 2;
        const x1 = cx + Math.cos(angle1) * r;
        const y1 = cy + Math.sin(angle1) * r;
        const x2 = cx + Math.cos(angle2) * r;
        const y2 = cy + Math.sin(angle2) * r;

        return (
          <motion.line
            key={`edge-${i}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-[var(--text)] opacity-20"
          />
        );
      })}

      {/* Dynamic Nodes */}
      {nodes.map((n, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        return (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: i * 0.1 }}
            onClick={() => n.slug && router.push(`/blog/${n.slug}`)}
            className="cursor-pointer group"
          >
            {/* Glow effect on hover */}
            <circle 
              cx={x} cy={y} r={35} 
              className="fill-[var(--accent)] opacity-0 group-hover:opacity-10 transition-opacity"
            />
            
            {/* Main Node */}
            <circle 
              cx={x} cy={y} r={28} 
              className="fill-[var(--bg)] stroke-[var(--text)] stroke-1 opacity-80 group-hover:opacity-100 group-hover:stroke-[var(--accent)] transition-all"
            />
            
            {/* Node Label */}
            <text 
              x={x} y={y + 45} 
              textAnchor="middle" 
              className="fill-[var(--text)] text-[10px] uppercase tracking-widest font-light pointer-events-none group-hover:fill-[var(--accent)] transition-colors"
            >
              {n.label}
            </text>

            {/* Center dot */}
            <circle 
              cx={x} cy={y} r={2} 
              className="fill-[var(--accent)]"
            />
          </motion.g>
        );
      })}

      {/* Center Label */}
      <text 
        x={cx} y={cy} 
        textAnchor="middle" 
        className="fill-[var(--accent)] text-xs font-mono opacity-30 uppercase tracking-[0.4em] pointer-events-none"
      >
        Origin
      </text>
    </svg>
  );
}
