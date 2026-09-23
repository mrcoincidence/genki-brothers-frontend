// app/components/InteractiveWorkCard.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface WorkProps {
  title: string;
  category: string;
  year: string;
  index: string;
}

export default function InteractiveWorkCard({ title, category, year, index }: WorkProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // マウスの相対位置（カーソル移動）をリアルタイム計算
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full border-b border-zinc-800 py-16 px-6 cursor-pointer overflow-hidden group select-none"
    >
      {/* マウス追従型のインタラクティブ背景（スポットライト & カラーシフター） */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* インデックス & カテゴリ */}
        <div className="flex items-center space-x-6 text-xs text-zinc-500 uppercase tracking-widest font-mono">
          <span>{index}</span>
          <span>/</span>
          <span>{category}</span>
        </div>

        {/* マウス挙動でダイナミックに変容するタイポグラフィ */}
        <motion.h3
          animate={{
            x: isHovered ? (mousePosition.x - 300) * 0.05 : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="text-4xl md:text-7xl font-light tracking-tighter text-zinc-300 group-hover:text-white group-hover:font-serif transition-colors duration-300"
        >
          {title}
        </motion.h3>

        {/* 制作年 */}
        <div className="text-xs font-mono text-zinc-600 group-hover:text-zinc-400">
          [{year}]
        </div>
      </div>
    </motion.div>
  );
}