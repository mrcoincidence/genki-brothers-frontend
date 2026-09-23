// app/components/InvaderCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';

interface InvaderCanvasProps {
  isDarkMode: boolean;
}

// --- 8ビット スプライト定義 ---
const playerSprite = [
  [1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
];

const alienFrame1 = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,0,0,1,0,0,0,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [0,1,1,0,1,1,1,0,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [0,0,0,1,1,0,1,1,0,0,0]
];

const alienFrame2 = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [1,0,0,1,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,1,1,0,1,1,1,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,1,0,0,0,0,0,0,0,1,0]
];

const pacmanOpen = [
  [0,0,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,0,0,0,0],
  [1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,0,0,0,0],
  [1,1,1,1,1,1,0,0,0],
  [0,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,0,0]
];

const pacmanMid = [
  [0,0,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,0,0,0],
  [1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,0,0]
];

const ghostSprite1 = [
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,0,1,1,1,0,1,1,1],
  [1,1,0,1,1,1,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,1,0,0,1,0,0]
];

const ghostSprite2 = [
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,0,1,1,1,0,1,1,1],
  [1,1,0,1,1,1,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,0,1,1,0,1,1,0],
  [0,0,1,0,0,1,0,0,1,0]
];

// パックマン迷路レイアウト (1:壁, 0:通路/ドット, 2:ゴースト初期位置)
const mazeLayout = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,2,1,1,1,1,0,1,0,1],
  [0,0,0,0,1,2,2,2,2,2,1,0,0,0,0],
  [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

type Phase = 
  | 'INVADER_APPROACH' 
  | 'INVADER_NAGOYA' 
  | 'TRANSITION_PACMAN' 
  | 'PACMAN_MAZE' 
  | 'PACMAN_EATEN' 
  | 'TRANSITION_INVADER';

interface MazeGhost {
  gx: number;
  gy: number;
  x: number;
  y: number;
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  speed: number;
}

export default function InvaderCanvas({ isDarkMode }: InvaderCanvasProps) {
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

    const PIXEL_SIZE = Math.max(2, Math.floor(width / 450));
    const ALIEN_W = 11 * PIXEL_SIZE;
    const ALIEN_H = 8 * PIXEL_SIZE;
    const SPACING_X = ALIEN_W + 14;
    const SPACING_Y = ALIEN_H + 14;

    const colorAlien = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const colorPlayer = isDarkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.14)';
    const colorBullet = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.22)';
    const colorExplosion = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.18)';
    
    const colorMazeWall = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
    const colorDot = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
    const colorPacman = isDarkMode ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
    const colorGhost = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.09)';
    const colorText = isDarkMode ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.14)';

    let frame = 0;
    let phase: Phase = 'INVADER_APPROACH';
    let phaseTimer = 0;

    // インベーダー
    let playerX = 80;
    let playerY = height / 2;
    let playerCooldown = 0;
    let invaderBaseX = width + 100;
    let invaderBaseY = height / 2 - (2.5 * SPACING_Y);
    let invaderDirY = 1;

    let invaders: { col: number; row: number; alive: boolean; rx: number; ry: number }[] = [];
    let bullets: { x: number; y: number; dx: number; isPlayer: boolean }[] = [];
    let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    // パックマン
    let dots: boolean[][] = [];
    let pacmanGx = 1;
    let pacmanGy = 1;
    let pacmanPx = 0;
    let pacmanPy = 0;
    let pacmanDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'RIGHT';
    let pacmanDeathProgress = 0;
    let ghosts: MazeGhost[] = [];

    const rows = mazeLayout.length;
    const cols = mazeLayout[0].length;

    const initInvaders = () => {
      invaders = [];
      for (let col = 0; col < 6; col++) {
        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
          invaders.push({
            col,
            row: rowIdx,
            alive: true,
            rx: col * SPACING_X,
            ry: rowIdx * SPACING_Y,
          });
        }
      }
      invaderBaseX = width + 50;
      invaderBaseY = height / 2 - (2.5 * SPACING_Y);
      phase = 'INVADER_APPROACH';
      bullets = [];
      particles = [];
    };

    const initMazeScene = () => {
      dots = mazeLayout.map(row => row.map(cell => cell === 0));
      pacmanGx = 1;
      pacmanGy = 1;
      pacmanDir = 'RIGHT';
      pacmanDeathProgress = 0;
      phaseTimer = 0;

      // 最初の逃走時間（4〜5秒）を確保するために絶妙な初期位置を設定
      ghosts = [
        { gx: 7, gy: 4, x: 0, y: 0, dir: 'UP', speed: 0.042 },
        { gx: 7, gy: 5, x: 0, y: 0, dir: 'LEFT', speed: 0.042 },
        { gx: 13, gy: 1, x: 0, y: 0, dir: 'DOWN', speed: 0.04 },
        { gx: 13, gy: 9, x: 0, y: 0, dir: 'LEFT', speed: 0.042 },
        { gx: 7, gy: 9, x: 0, y: 0, dir: 'UP', speed: 0.04 },
      ];
    };

    initInvaders();

    const drawSprite = (
      sprite: number[][], 
      x: number, 
      y: number, 
      color: string, 
      angle: number = 0
    ) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(x, y);
      if (angle !== 0) ctx.rotate(angle);

      const rLen = sprite.length;
      const cLen = sprite[0].length;
      for (let r = 0; r < rLen; r++) {
        for (let c = 0; c < cLen; c++) {
          if (sprite[r][c]) {
            ctx.fillRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }
      ctx.restore();
    };

    const drawPacmanDeath = (x: number, y: number, progress: number, color: string) => {
      if (progress >= 1.0) return;
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(x + 4.5 * PIXEL_SIZE, y + 4.5 * PIXEL_SIZE);
      ctx.rotate(-Math.PI / 2);
      
      const angle = progress * Math.PI * 0.98;
      const radius = 5 * PIXEL_SIZE * (1 - progress * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, Math.PI * 2 - angle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const spawnExplosion = (x: number, y: number) => {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: x + ALIEN_W / 2,
          y: y + ALIEN_H / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1.0,
        });
      }
    };

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // PHASE 1 & 2: インベーダー & 名古屋撃ち
      // ==========================================
      if (phase === 'INVADER_APPROACH' || phase === 'INVADER_NAGOYA') {
        if (frame % 2 === 0) {
          invaderBaseY += 1.5 * invaderDirY;
          if (invaderBaseY > height - (5 * SPACING_Y) - 80 || invaderBaseY < 80) {
            invaderDirY *= -1;
          }
        }

        if (phase === 'INVADER_APPROACH') {
          invaderBaseX -= 3.5;
          if (invaderBaseX <= playerX + 55) {
            invaderBaseX = playerX + 55;
            phase = 'INVADER_NAGOYA';
          }
          playerY += (height / 2 - playerY) * 0.1;
        } 
        else if (phase === 'INVADER_NAGOYA') {
          const aliveInvaders = invaders.filter(i => i.alive);
          if (aliveInvaders.length === 0) {
            phase = 'TRANSITION_PACMAN';
            phaseTimer = 0;
          } else {
            aliveInvaders.sort((a, b) => {
              if (a.col !== b.col) return a.col - b.col;
              return b.row - a.row;
            });

            const target = aliveInvaders[0];
            const targetY = invaderBaseY + target.ry + ALIEN_H / 2 - (2.5 * PIXEL_SIZE);

            playerY += (targetY - playerY) * 0.4;

            if (Math.abs(playerY - targetY) < 16 && playerCooldown <= 0) {
              bullets.push({ x: playerX + 6 * PIXEL_SIZE, y: playerY + 2 * PIXEL_SIZE, dx: 22, isPlayer: true });
              playerCooldown = 3;
            }
          }
        }

        if (playerCooldown > 0) playerCooldown--;

        if (frame % 16 === 0) {
          const alive = invaders.filter(i => i.alive);
          if (alive.length > 0) {
            const shooter = alive[Math.floor(Math.random() * alive.length)];
            const sY = invaderBaseY + shooter.ry + ALIEN_H / 2;
            bullets.push({ x: playerX - 18, y: sY, dx: -10, isPlayer: false });
          }
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.dx;
          ctx.fillStyle = colorBullet;
          ctx.fillRect(b.x, b.y, 8, 3);

          if (b.isPlayer) {
            for (let j = 0; j < invaders.length; j++) {
              const inv = invaders[j];
              if (!inv.alive) continue;
              const ix = invaderBaseX + inv.rx;
              const iy = invaderBaseY + inv.ry;

              if (b.x > ix && b.x < ix + ALIEN_W && b.y > iy && b.y < iy + ALIEN_H) {
                inv.alive = false;
                bullets.splice(i, 1);
                spawnExplosion(ix, iy);
                break;
              }
            }
          }
          if (bullets[i] && (b.x > width || b.x < -50)) bullets.splice(i, 1);
        }

        drawSprite(playerSprite, playerX, playerY, colorPlayer);
        const isAnimFrame2 = Math.floor(frame / 16) % 2 === 0;
        const currentAlienSprite = isAnimFrame2 ? alienFrame2 : alienFrame1;

        invaders.forEach((inv) => {
          if (inv.alive) {
            drawSprite(currentAlienSprite, invaderBaseX + inv.rx, invaderBaseY + inv.ry, colorAlien);
          }
        });
      }

      // ==========================================
      // PHASE 3: トランジション
      // ==========================================
      else if (phase === 'TRANSITION_PACMAN') {
        phaseTimer++;
        ctx.fillStyle = colorText;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STAGE CLEAR', width / 2, height / 2);

        if (phaseTimer > 25) {
          initMazeScene();
          phase = 'PACMAN_MAZE';
        }
      }

      // ==========================================
      // PHASE 4: パックマン迷路逃走劇 (4〜5秒間保持)
      // ==========================================
      else if (phase === 'PACMAN_MAZE' || phase === 'PACMAN_EATEN') {
        phaseTimer++;

        const cellSize = Math.min(Math.floor(width / (cols + 4)), Math.floor(height / (rows + 4)), 32);
        const mazeW = cols * cellSize;
        const mazeH = rows * cellSize;
        const startX = (width - mazeW) / 2;
        const startY = (height - mazeH) / 2;

        ctx.lineWidth = Math.max(2, PIXEL_SIZE);
        ctx.strokeStyle = colorMazeWall;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cellX = startX + c * cellSize;
            const cellY = startY + r * cellSize;

            if (mazeLayout[r][c] === 1) {
              ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
            } else if (mazeLayout[r][c] === 0 && dots[r] && dots[r][c]) {
              ctx.fillStyle = colorDot;
              ctx.fillRect(cellX + cellSize / 2 - 2, cellY + cellSize / 2 - 2, 4, 4);
            }
          }
        }

        if (phase === 'PACMAN_MAZE') {
          const moveSpeed = 0.11;
          const curGx = Math.round(pacmanGx);
          const curGy = Math.round(pacmanGy);

          if (dots[curGy] && dots[curGy][curGx]) {
            dots[curGy][curGx] = false;
          }

          // マス中央到達判定
          if (Math.abs(pacmanGx - curGx) <= moveSpeed / 2 && Math.abs(pacmanGy - curGy) <= moveSpeed / 2) {
            pacmanGx = curGx;
            pacmanGy = curGy;

            const possibleDirs: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [];
            if (curGy > 0 && mazeLayout[curGy - 1][curGx] !== 1) possibleDirs.push('UP');
            if (curGy < rows - 1 && mazeLayout[curGy + 1][curGx] !== 1) possibleDirs.push('DOWN');
            if (curGx > 0 && mazeLayout[curGy][curGx - 1] !== 1) possibleDirs.push('LEFT');
            if (curGx < cols - 1 && mazeLayout[curGy][curGx + 1] !== 1) possibleDirs.push('RIGHT');

            const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }[pacmanDir];
            const forward = possibleDirs.filter(d => d !== opposite);
            const choices = forward.length > 0 ? forward : possibleDirs;

            if (choices.length > 0) {
              pacmanDir = choices[Math.floor(Math.random() * choices.length)];
            }
          }

          // 移動制御
          if (pacmanDir === 'RIGHT') {
            if (curGx + 1 < cols && mazeLayout[curGy][curGx + 1] !== 1 || pacmanGx < curGx) pacmanGx += moveSpeed;
          } else if (pacmanDir === 'LEFT') {
            if (curGx - 1 >= 0 && mazeLayout[curGy][curGx - 1] !== 1 || pacmanGx > curGx) pacmanGx -= moveSpeed;
          } else if (pacmanDir === 'DOWN') {
            if (curGy + 1 < rows && mazeLayout[curGy + 1][curGx] !== 1 || pacmanGy < curGy) pacmanGy += moveSpeed;
          } else if (pacmanDir === 'UP') {
            if (curGy - 1 >= 0 && mazeLayout[curGy - 1][curGx] !== 1 || pacmanGy > curGy) pacmanGy -= moveSpeed;
          }

          pacmanPx = startX + pacmanGx * cellSize + (cellSize - 9 * PIXEL_SIZE) / 2;
          pacmanPy = startY + pacmanGy * cellSize + (cellSize - 9 * PIXEL_SIZE) / 2;

          let caught = false;
          // 4秒間（240フレーム）はしっかりと逃走劇を見せるため無敵保護
          const isProtected = phaseTimer < 230;

          ghosts.forEach((g) => {
            // 4秒過ぎたらゴーストの追尾スピードを少しアップして包囲
            const currentGhostSpeed = isProtected ? g.speed : g.speed * 1.35;
            const gCurX = Math.round(g.gx);
            const gCurY = Math.round(g.gy);

            if (Math.abs(g.gx - gCurX) <= currentGhostSpeed / 2 && Math.abs(g.gy - gCurY) <= currentGhostSpeed / 2) {
              g.gx = gCurX;
              g.gy = gCurY;

              const possibleDirs: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [];
              if (gCurY > 0 && mazeLayout[gCurY - 1][gCurX] !== 1) possibleDirs.push('UP');
              if (gCurY < rows - 1 && mazeLayout[gCurY + 1][gCurX] !== 1) possibleDirs.push('DOWN');
              if (gCurX > 0 && mazeLayout[gCurY][gCurX - 1] !== 1) possibleDirs.push('LEFT');
              if (gCurX < cols - 1 && mazeLayout[gCurY][gCurX + 1] !== 1) possibleDirs.push('RIGHT');

              if (possibleDirs.length > 0) {
                const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }[g.dir];
                const forwardDirs = possibleDirs.filter(d => d !== opposite);
                const choices = forwardDirs.length > 0 ? forwardDirs : possibleDirs;

                let bestDir = choices[0];
                let minDist = 9999;
                choices.forEach(d => {
                  let nx = gCurX, ny = gCurY;
                  if (d === 'UP') ny--;
                  if (d === 'DOWN') ny++;
                  if (d === 'LEFT') nx--;
                  if (d === 'RIGHT') nx++;
                  const dist = Math.hypot(curGx - nx, curGy - ny);
                  if (dist < minDist) {
                    minDist = dist;
                    bestDir = d;
                  }
                });

                // 最初の4秒は適度に距離を置き、後半は追尾精度を最大化
                const chaseRatio = isProtected ? 0.6 : 0.9;
                g.dir = Math.random() < chaseRatio ? bestDir : choices[Math.floor(Math.random() * choices.length)];
              }
            }

            if (g.dir === 'RIGHT') {
              if (gCurX + 1 < cols && mazeLayout[gCurY][gCurX + 1] !== 1 || g.gx < gCurX) g.gx += currentGhostSpeed;
            } else if (g.dir === 'LEFT') {
              if (gCurX - 1 >= 0 && mazeLayout[gCurY][gCurX - 1] !== 1 || g.gx > gCurX) g.gx -= currentGhostSpeed;
            } else if (g.dir === 'DOWN') {
              if (gCurY + 1 < rows && mazeLayout[gCurY + 1][gCurX] !== 1 || g.gy < gCurY) g.gy += currentGhostSpeed;
            } else if (g.dir === 'UP') {
              if (gCurY - 1 >= 0 && mazeLayout[gCurY - 1][gCurX] !== 1 || g.gy > gCurY) g.gy -= currentGhostSpeed;
            }

            g.x = startX + g.gx * cellSize + (cellSize - 10 * PIXEL_SIZE) / 2;
            g.y = startY + g.gy * cellSize + (cellSize - 9 * PIXEL_SIZE) / 2;

            const isGhostAnim2 = Math.floor(frame / 10) % 2 === 0;
            drawSprite(isGhostAnim2 ? ghostSprite2 : ghostSprite1, g.x, g.y, colorGhost);

            if (!isProtected && Math.abs(g.x - pacmanPx) < cellSize * 0.65 && Math.abs(g.y - pacmanPy) < cellSize * 0.65) {
              caught = true;
            }
          });

          let angle = 0;
          if (pacmanDir === 'DOWN') angle = Math.PI / 2;
          if (pacmanDir === 'LEFT') angle = Math.PI;
          if (pacmanDir === 'UP') angle = -Math.PI / 2;

          const pFrame = Math.floor(frame / 5) % 2;
          drawSprite(pFrame === 0 ? pacmanOpen : pacmanMid, pacmanPx, pacmanPy, colorPacman, angle);

          // 4.5〜5秒（270〜300フレーム）の間に捕獲・または自動で死亡フェーズへ移行
          if ((!isProtected && caught) || phaseTimer > 280) {
            phase = 'PACMAN_EATEN';
            phaseTimer = 0;
          }
        }

        // ==========================================
        // PHASE 5: パックマン死亡アニメーション
        // ==========================================
        if (phase === 'PACMAN_EATEN') {
          pacmanDeathProgress = Math.min(1.0, phaseTimer / 40);

          ghosts.forEach((g) => {
            const isGhostAnim2 = Math.floor(frame / 10) % 2 === 0;
            drawSprite(isGhostAnim2 ? ghostSprite2 : ghostSprite1, g.x, g.y, colorGhost);
          });

          drawPacmanDeath(pacmanPx, pacmanPy, pacmanDeathProgress, colorPacman);

          if (pacmanDeathProgress >= 1.0 && phaseTimer === 41) {
            spawnExplosion(pacmanPx, pacmanPy);
          }

          if (phaseTimer > 70) {
            phase = 'TRANSITION_INVADER';
            phaseTimer = 0;
          }
        }
      }

      // ==========================================
      // PHASE 6: トランジション (インベーダーへ復帰)
      // ==========================================
      else if (phase === 'TRANSITION_INVADER') {
        phaseTimer++;
        if (phaseTimer > 25) {
          initInvaders();
        }
      }

      // パーティクル
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        
        ctx.fillStyle = colorExplosion;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
        ctx.globalAlpha = 1.0;

        if (p.life <= 0) particles.splice(i, 1);
      }

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