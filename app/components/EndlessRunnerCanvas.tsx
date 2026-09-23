// app/components/EndlessRunnerCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';

interface EndlessRunnerCanvasProps {
  isDarkMode: boolean;
}

type RunnerState = 'RUN' | 'JUMP' | 'FLY' | 'SLIDE' | 'POSE';

interface BgElement {
  x: number;
  type: 'tree' | 'bush';
  scale: number;
}

export default function EndlessRunnerCanvas({ isDarkMode }: EndlessRunnerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // アニメーション用ステート
    let frame = 0;
    let state: RunnerState = 'RUN';
    let runStyle: 'NORMAL' | 'NINJA' = 'NORMAL';
    let stateTimer = 0;

    // ランナーの物理設定
    const groundY = height * 0.75;
    const defaultRunnerX = Math.min(width * 0.3, 400); 
    let runnerX = defaultRunnerX;
    let runnerY = groundY;
    let velocityY = 0;
    const gravity = 0.6; // 滞空時間を少し長くするため重力を下げる

    // 背景要素 (木・草)
    const bgElements: BgElement[] = [];
    for (let i = 0; i < 12; i++) {
      bgElements.push({
        x: Math.random() * width * 1.5,
        type: Math.random() > 0.5 ? 'tree' : 'bush',
        scale: 0.5 + Math.random() * 0.5,
      });
    }

    // 障害物管理
    let obstacleActive = false;
    let obstacleX = -100;
    let obstacleType: 'JUMP_OVER' | 'TRIP' = 'JUMP_OVER';

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const strokeColor = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
      const accentColor = isDarkMode ? '#FFE100' : '#111111';
      const groundColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

      // スクロール速度設定
      let currentSpeed = runStyle === 'NINJA' ? 8 : 5;
      if (state === 'SLIDE') currentSpeed = Math.max(0, 5 - stateTimer * 0.1);
      if (state === 'POSE') currentSpeed = 0;

      // ランナーの位置復帰 (前に吹っ飛んだ後、走りながら徐々に元の位置に戻る)
      if (state === 'RUN' && runnerX > defaultRunnerX) {
        runnerX -= 1;
      }

      // --- 1. 背景の描画 ---
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 1.5;

      bgElements.forEach((el) => {
        if (currentSpeed > 0) el.x -= currentSpeed * 0.5;
        if (el.x < -100) el.x = width + Math.random() * 200;

        ctx.beginPath();
        if (el.type === 'tree') {
          const treeH = 50 * el.scale;
          ctx.moveTo(el.x, groundY);
          ctx.lineTo(el.x, groundY - treeH);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(el.x, groundY - treeH - 12 * el.scale, 16 * el.scale, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(el.x, groundY - 6 * el.scale, 10 * el.scale, Math.PI, 0);
          ctx.stroke();
        }
      });

      // --- 2. 地面ライン ---
      ctx.beginPath();
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 2;
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // --- 3. 障害物の生成と判定 ---
      if (!obstacleActive && state === 'RUN') {
        stateTimer++;
        if (stateTimer > 150) { 
          obstacleActive = true;
          obstacleX = width + 50; 
          obstacleType = Math.random() > 0.4 ? 'JUMP_OVER' : 'TRIP';
          stateTimer = 0;
        }
      }

      if (obstacleActive) {
        obstacleX -= currentSpeed;

        // 三角コーンの描画
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 2;
        ctx.moveTo(obstacleX, groundY);
        ctx.lineTo(obstacleX + 12, groundY - 24);
        ctx.lineTo(obstacleX + 24, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const dist = obstacleX - runnerX;
        
        if (state === 'RUN') {
          if (obstacleType === 'JUMP_OVER' && dist < 140 && dist > 110) {
            state = 'JUMP';
            velocityY = -13; 
          } else if (obstacleType === 'TRIP' && dist < 40 && dist > 10) {
            state = 'FLY';
            velocityY = -10;
            stateTimer = 0;
          }
        }

        if (obstacleX < -100) {
          obstacleActive = false;
        }
      }

      // --- 4. 状態ごとの物理演算・タイマー管理 ---
      if (state === 'JUMP') {
        runnerY += velocityY;
        velocityY += gravity;
        if (runnerY >= groundY) {
          runnerY = groundY;
          state = 'RUN';
        }
      } else if (state === 'FLY') {
        runnerY += velocityY;
        velocityY += gravity;
        runnerX += 3; // 空中で前に放り出される

        if (runnerY >= groundY) {
          runnerY = groundY;
          state = 'SLIDE';
          stateTimer = 0;
        }
      } else {
        runnerY = groundY;
      }

      if (state === 'SLIDE') {
        stateTimer++;
        runnerX += Math.max(0, 4 - stateTimer * 0.1); // スライディングで前に進みながら止まる
        if (stateTimer > 40) {
          state = 'POSE';
          stateTimer = 0;
        }
      }

      if (state === 'POSE') {
        stateTimer++;
        if (stateTimer > 180) { // セクシーポーズでごまかす時間
          state = 'RUN';
          stateTimer = 0;
          runStyle = Math.random() > 0.6 ? 'NINJA' : 'NORMAL'; // 復帰時にランダムで忍者走りに
        }
      }

      // --- 5. ピクトグラム走者の描画 ---
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.fillStyle = accentColor;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const headRadius = 7;
      const bodyHeight = 24;

      if (state === 'RUN') {
        if (runStyle === 'NINJA') {
          // ★忍者走り (前傾姿勢、腕を後ろにピーン)
          const currY = runnerY - 26; 
          ctx.beginPath(); ctx.arc(runnerX + 15, currY - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(runnerX - 5, currY + 15); ctx.lineTo(runnerX + 12, currY); ctx.stroke();
          // 腕
          ctx.beginPath();
          ctx.moveTo(runnerX + 5, currY + 5); ctx.lineTo(runnerX - 15, currY - 5);
          ctx.moveTo(runnerX + 2, currY + 8); ctx.lineTo(runnerX - 18, currY - 2);
          ctx.stroke();
          // 脚（高速回転）
          const legAngle = frame * 0.6;
          ctx.beginPath();
          ctx.moveTo(runnerX - 5, currY + 15); ctx.lineTo(runnerX - 5 + Math.sin(legAngle) * 16, currY + 15 + Math.cos(legAngle) * 16);
          ctx.moveTo(runnerX - 5, currY + 15); ctx.lineTo(runnerX - 5 - Math.sin(legAngle) * 16, currY + 15 - Math.cos(legAngle) * 16);
          ctx.stroke();
        } else {
          // 通常走り
          const currY = runnerY - 38;
          const legAngle = Math.sin(frame * 0.3) * 0.8;
          const armAngle = Math.sin(frame * 0.3 + Math.PI) * 0.8;
          
          ctx.beginPath(); ctx.arc(runnerX, currY - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(runnerX, currY); ctx.lineTo(runnerX + 4, currY + bodyHeight); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(runnerX + 2, currY + 6); ctx.lineTo(runnerX + Math.sin(armAngle) * 16, currY + 16 + Math.cos(armAngle) * 6);
          ctx.moveTo(runnerX + 2, currY + 6); ctx.lineTo(runnerX - Math.sin(armAngle) * 16, currY + 16 - Math.cos(armAngle) * 6);
          ctx.stroke();
          const hipX = runnerX + 4;
          ctx.beginPath();
          ctx.moveTo(hipX, currY + bodyHeight); ctx.lineTo(hipX + Math.sin(legAngle) * 18, currY + bodyHeight + 16);
          ctx.moveTo(hipX, currY + bodyHeight); ctx.lineTo(hipX - Math.sin(legAngle) * 18, currY + bodyHeight + 16);
          ctx.stroke();
        }
      } else if (state === 'JUMP') {
        const currY = runnerY - 38;
        // ★頂点付近で手足を高速ジタバタもがく
        const isApex = Math.abs(velocityY) < 4;
        const legAngle = isApex ? Math.sin(frame * 0.8) * 1.2 : 0.6;
        const armAngle = isApex ? Math.cos(frame * 0.8) * 1.5 : -0.8;

        ctx.beginPath(); ctx.arc(runnerX, currY - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(runnerX, currY); ctx.lineTo(runnerX + 4, currY + bodyHeight); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(runnerX + 2, currY + 6); ctx.lineTo(runnerX + Math.sin(armAngle) * 16, currY + 16 + Math.cos(armAngle) * 6);
        ctx.moveTo(runnerX + 2, currY + 6); ctx.lineTo(runnerX - Math.sin(armAngle) * 16, currY + 16 - Math.cos(armAngle) * 6);
        ctx.stroke();
        const hipX = runnerX + 4;
        ctx.beginPath();
        ctx.moveTo(hipX, currY + bodyHeight); ctx.lineTo(hipX + Math.sin(legAngle) * 18, currY + bodyHeight + 16);
        ctx.moveTo(hipX, currY + bodyHeight); ctx.lineTo(hipX - Math.sin(legAngle) * 18, currY + bodyHeight + 16);
        ctx.stroke();

      } else if (state === 'FLY') {
        // ★空中を大の字でグルグル回転しながら吹っ飛ぶ
        const currY = runnerY - 20;
        ctx.save();
        ctx.translate(runnerX, currY);
        ctx.rotate(frame * 0.2); // 高速回転

        ctx.beginPath(); ctx.arc(0, -15, headRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 12); ctx.stroke();
        // 手足大の字
        ctx.beginPath();
        ctx.moveTo(0, -2); ctx.lineTo(15, -15);
        ctx.moveTo(0, -2); ctx.lineTo(-15, -15);
        ctx.moveTo(0, 12); ctx.lineTo(15, 25);
        ctx.moveTo(0, 12); ctx.lineTo(-15, 25);
        ctx.stroke();
        ctx.restore();

      } else if (state === 'SLIDE') {
        // ★顔面スライディング
        const slideY = groundY - 5;
        ctx.beginPath(); ctx.arc(runnerX + 20, slideY - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(runnerX - 15, slideY); ctx.lineTo(runnerX + 15, slideY); ctx.stroke();
        // 後ろに伸びる手足
        ctx.beginPath();
        ctx.moveTo(runnerX, slideY); ctx.lineTo(runnerX - 20, slideY - 10);
        ctx.moveTo(runnerX - 5, slideY); ctx.lineTo(runnerX - 25, slideY - 5);
        ctx.stroke();

        // 摩擦の火花・砂ぼこりエフェクト
        ctx.beginPath();
        ctx.moveTo(runnerX + 25, slideY); ctx.lineTo(runnerX + 40, slideY);
        ctx.moveTo(runnerX + 28, slideY - 4); ctx.lineTo(runnerX + 35, slideY - 4);
        ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
        ctx.stroke();

      } else if (state === 'POSE') {
        // ★転んだのをごまかす「セクシーポーズ（横たわり頬杖）」
        const poseY = groundY - 5;
        
        ctx.beginPath(); ctx.arc(runnerX + 15, poseY - 18, headRadius, 0, Math.PI * 2); ctx.fill(); // 頭
        ctx.beginPath(); ctx.moveTo(runnerX - 10, poseY); ctx.lineTo(runnerX + 12, poseY - 12); ctx.stroke(); // 胴体
        
        // 腕（頬杖と腰当て）
        ctx.beginPath(); 
        ctx.moveTo(runnerX + 5, poseY - 6); ctx.lineTo(runnerX + 10, poseY); ctx.lineTo(runnerX + 15, poseY - 12); // 下の腕
        ctx.moveTo(runnerX, poseY - 3); ctx.lineTo(runnerX - 5, poseY - 18); // 上の腕
        ctx.stroke();

        // 脚（クロス）
        ctx.beginPath(); 
        ctx.moveTo(runnerX - 10, poseY); ctx.lineTo(runnerX - 25, poseY - 6); ctx.lineTo(runnerX - 35, poseY); // 上の足
        ctx.moveTo(runnerX - 10, poseY); ctx.lineTo(runnerX - 30, poseY); // 下の足
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}