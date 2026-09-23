// app/components/InteractiveLogo.tsx
'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  mousePos: { x: number; y: number };
}

// SVGの文字グループID一覧
const letters = [
  { id: 'G', path: <path d="M34,28.3V0h-5.7C12.7,0,0,12.7,0,28.3s12.7,28.3,28.3,28.3H34h11.3V28.3H34z"/> },
  { id: 'E', path: <polygon points="73.7,45.4 85,22.7 73.7,22.7 73.7,11.3 96.4,11.3 96.4,0 51,0 51,56.7 96.4,56.7 96.4,45.4"/> },
  { id: 'N', path: <polygon points="141.7,0 141.7,22.7 119.1,0 102,0 102,56.7 158.7,56.7 158.7,28.3 158.7,0"/> },
  { id: 'K', path: <polygon points="164.4,0 164.4,56.7 209.8,56.7 198.4,28.3 209.8,0"/> },
  { id: 'I', path: <rect x="215.4" y="0" width="22.7" height="56.7"/> },
  { id: 'B', path: <path d="M304.2,21.3c1.2-2.1,1.9-4.5,1.9-7.1C306.1,6.3,299.8,0,292,0h-25.5v56.7H292c11,0,19.8-8.9,19.8-19.8C311.8,30.5,308.8,24.9,304.2,21.3z"/> },
  { id: 'R', path: <path d="M348.7,28.3c7.8,0,14.2-6.3,14.2-14.2S356.5,0,348.7,0h-31.2v56.7h45.4L348.7,28.3z"/> },
  { id: 'O', path: <path d="M396.8,0c15.6,0,28.3,12.7,28.3,28.3c0,15.7-12.7,28.3-28.3,28.3c-15.7,0-28.3-12.7-28.3-28.3C368.5,12.7,381.2,0,396.8,0z"/> },
  { id: 'S', path: <path d="M470.5,0H445c-7.8,0-14.2,6.3-14.2,14.2c0,7.8,6.3,14.2,14.2,14.2h-14.2v28.3h25.5c7.8,0,14.2-6.3,14.2-14.2c0-7.8-6.3-14.2-14.2-14.2h14.2V0z"/> }
];

export default function InteractiveLogo({ mousePos }: LogoProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 470.5 56.7"
        className="w-full h-auto overflow-visible fill-current text-black dark:text-white transition-colors duration-500"
      >
        {letters.map((item, index) => {
          // 各文字の画面位置に応じたマウスとの距離計算（パララックスアニメーション）
          const factor = (index - 4) * 0.03; // 中心からのオフセット
          const moveX = (mousePos.x - 600) * factor;
          const moveY = (mousePos.y - 300) * 0.02;

          return (
            <motion.g
              key={item.id}
              id={item.id}
              animate={{
                x: moveX,
                y: moveY,
                rotate: moveX * 0.1,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
                mass: 0.8,
              }}
              className="origin-center hover:opacity-80 transition-opacity"
            >
              {item.path}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}