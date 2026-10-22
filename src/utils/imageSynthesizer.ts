import { AspectRatioType, GeneratedImage } from '../types/imageStudio';
import { getDimensionsForRatio, hashSeed, STYLE_PRESETS, LIGHTING_PRESETS } from './promptEnhancer';

// Pseudorandom generator using mulberry32 for deterministic artwork
function createRng(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function synthesizeArtwork(
  prompt: string,
  styleId: string,
  lightingId: string,
  aspectRatio: AspectRatioType,
  seedInput?: number
): Promise<string> {
  return new Promise((resolve) => {
    const seed = seedInput !== undefined ? seedInput : hashSeed(prompt + styleId + lightingId);
    const rng = createRng(seed);
    const { width, height } = getDimensionsForRatio(aspectRatio, 1024);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    const style = STYLE_PRESETS.find((s) => s.id === styleId) || STYLE_PRESETS[0];
    const lighting = LIGHTING_PRESETS.find((l) => l.id === lightingId) || LIGHTING_PRESETS[0];

    // Background gradient pass
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
    if (styleId === 'cyberpunk') {
      bgGrad.addColorStop(0, '#050510');
      bgGrad.addColorStop(0.5, '#0b0f24');
      bgGrad.addColorStop(1, '#1e0836');
    } else if (styleId === 'fantasy') {
      bgGrad.addColorStop(0, '#0a091e');
      bgGrad.addColorStop(0.4, '#1b1442');
      bgGrad.addColorStop(0.8, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
    } else if (styleId === 'scifi') {
      bgGrad.addColorStop(0, '#02040a');
      bgGrad.addColorStop(0.5, '#0a102b');
      bgGrad.addColorStop(1, '#1b0c3a');
    } else if (styleId === 'anime') {
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.4, '#e11d48');
      bgGrad.addColorStop(0.7, '#fb7185');
      bgGrad.addColorStop(1, '#fed7aa');
    } else if (styleId === 'oil_painting') {
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(0.5, '#451a03');
      bgGrad.addColorStop(1, '#78350f');
    } else if (styleId === 'render_3d') {
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#312e81');
    } else if (styleId === 'minimalist') {
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(0.6, '#e2e8f0');
      bgGrad.addColorStop(1, '#cbd5e1');
    } else {
      // Photoreal default
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.4, '#1e293b');
      bgGrad.addColorStop(0.8, '#334155');
      bgGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Style-specific layered drawing
    if (styleId === 'cyberpunk') {
      drawCyberpunkScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'fantasy') {
      drawFantasyScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'scifi') {
      drawSciFiScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'anime') {
      drawAnimeScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'oil_painting') {
      drawOilPaintingScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'render_3d') {
      draw3DScene(ctx, width, height, rng, lighting.colorTone);
    } else if (styleId === 'minimalist') {
      drawMinimalistScene(ctx, width, height, rng, lighting.colorTone);
    } else {
      drawPhotorealScene(ctx, width, height, rng, lighting.colorTone);
    }

    // Atmospheric lighting overlay pass
    applyLightingOverlay(ctx, width, height, lightingId, rng);

    // Subtle film grain / texture pass
    applyTextureGrain(ctx, width, height, rng, styleId);

    // Artistic signature watermark in bottom corner
    drawArtisticBranding(ctx, width, height, style.name);

    resolve(canvas.toDataURL('image/png', 0.95));
  });
}

function drawCyberpunkScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Perspective neon grid on ground
  const horizon = height * 0.65;
  ctx.save();
  const gridGrad = ctx.createLinearGradient(0, horizon, 0, height);
  gridGrad.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
  gridGrad.addColorStop(1, 'rgba(217, 70, 239, 0.35)');
  ctx.strokeStyle = gridGrad;
  ctx.lineWidth = 1.5;

  const vpX = width * (0.4 + rng() * 0.2);
  for (let x = -width; x <= width * 2; x += width * 0.08) {
    ctx.beginPath();
    ctx.moveTo(vpX, horizon);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = horizon; y <= height; y += (height - horizon) * 0.12) {
    const factor = Math.pow((y - horizon) / (height - horizon), 2);
    const curY = horizon + factor * (height - horizon);
    ctx.beginPath();
    ctx.moveTo(0, curY);
    ctx.lineTo(width, curY);
    ctx.stroke();
  }
  ctx.restore();

  // Distant glowing mega-skyscrapers
  const buildingCount = 14;
  for (let i = 0; i < buildingCount; i++) {
    const bWidth = width * (0.05 + rng() * 0.09);
    const bHeight = height * (0.3 + rng() * 0.45);
    const bX = (i / buildingCount) * width + (rng() - 0.5) * 30;
    const bY = horizon - bHeight;

    const bGrad = ctx.createLinearGradient(bX, bY, bX + bWidth, horizon);
    bGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    bGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
    ctx.fillStyle = bGrad;
    ctx.fillRect(bX, bY, bWidth, bHeight);

    // Glowing vertical window matrix
    ctx.fillStyle = rng() > 0.5 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(217, 70, 239, 0.7)';
    for (let wx = bX + 6; wx < bX + bWidth - 6; wx += 8) {
      for (let wy = bY + 10; wy < horizon - 20; wy += 12) {
        if (rng() > 0.6) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }

    // Rooftop antenna with red/cyan light
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bX + bWidth / 2, bY);
    ctx.lineTo(bX + bWidth / 2, bY - 24);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(bX + bWidth / 2, bY - 24, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Giant glowing cyber-sun / holo-sphere
  const sunX = width * 0.5;
  const sunY = horizon * 0.45;
  const sunRadius = Math.min(width, height) * 0.18;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
  sunGrad.addColorStop(0, '#f43f5e');
  sunGrad.addColorStop(0.5, '#d946ef');
  sunGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Flying vehicles / light trails
  for (let t = 0; t < 6; t++) {
    const startX = rng() * width;
    const startY = horizon * (0.2 + rng() * 0.5);
    const endX = startX + width * (0.2 + rng() * 0.3);
    const endY = startY + (rng() - 0.5) * 30;

    const trailGrad = ctx.createLinearGradient(startX, startY, endX, endY);
    trailGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    trailGrad.addColorStop(0.8, '#06b6d4');
    trailGrad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

function drawFantasyScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Majestic celestial double moons
  const moonX = width * 0.72;
  const moonY = height * 0.22;
  const moonR = Math.min(width, height) * 0.14;

  const moonGrad = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR);
  moonGrad.addColorStop(0, '#fef08a');
  moonGrad.addColorStop(0.6, '#38bdf8');
  moonGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Floating mythical islands
  const islandCount = 5;
  for (let i = 0; i < islandCount; i++) {
    const isW = width * (0.18 + rng() * 0.22);
    const isH = height * (0.12 + rng() * 0.15);
    const isX = (i / islandCount) * width * 0.85 + width * 0.05;
    const isY = height * (0.35 + rng() * 0.3);

    // Floating rock base
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(isX + isW / 2, isY, isW / 2, isH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Jagged under-rock
    ctx.beginPath();
    ctx.moveTo(isX, isY);
    ctx.lineTo(isX + isW * 0.45, isY + isH);
    ctx.lineTo(isX + isW, isY);
    ctx.closePath();
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();

    // Luscious enchanted grass & crystal spires on top
    const grassGrad = ctx.createLinearGradient(isX, isY - 20, isX, isY);
    grassGrad.addColorStop(0, '#10b981');
    grassGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(isX + 10, isY - 15, isW - 20, 16);

    // Cascading magical waterfall falling into the void
    const wfX = isX + isW * (0.3 + rng() * 0.4);
    const wfGrad = ctx.createLinearGradient(wfX, isY, wfX, isY + isH * 1.6);
    wfGrad.addColorStop(0, '#67e8f9');
    wfGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.8)');
    wfGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = wfGrad;
    ctx.fillRect(wfX - 4, isY, 8, isH * 1.6);

    // Ancient glowing crystal spire
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(isX + isW * 0.2, isY - 8);
    ctx.lineTo(isX + isW * 0.23, isY - 45);
    ctx.lineTo(isX + isW * 0.26, isY - 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Swirling magical orbs & floating motes
  for (let m = 0; m < 50; m++) {
    const px = rng() * width;
    const py = rng() * height;
    const pr = 1 + rng() * 3.5;
    ctx.fillStyle = rng() > 0.4 ? 'rgba(52, 211, 153, 0.8)' : 'rgba(192, 132, 252, 0.8)';
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSciFiScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Deep space swirling nebula
  for (let n = 0; n < 4; n++) {
    const nX = width * (0.2 + rng() * 0.6);
    const nY = height * (0.2 + rng() * 0.6);
    const nR = Math.min(width, height) * (0.25 + rng() * 0.25);

    const nebGrad = ctx.createRadialGradient(nX, nY, 10, nX, nY, nR);
    nebGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
    nebGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.beginPath();
    ctx.arc(nX, nY, nR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Starfield with diffraction spikes on brightest stars
  for (let s = 0; s < 120; s++) {
    const sx = rng() * width;
    const sy = rng() * height;
    const size = rng() * 2.2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();

    if (size > 1.8 && rng() > 0.5) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(sx - 10, sy);
      ctx.lineTo(sx + 10, sy);
      ctx.moveTo(sx, sy - 10);
      ctx.lineTo(sx, sy + 10);
      ctx.stroke();
    }
  }

  // Giant ringed planet
  const pX = width * 0.25;
  const pY = height * 0.35;
  const pR = Math.min(width, height) * 0.2;

  // Planet body
  const planetGrad = ctx.createRadialGradient(pX - pR * 0.3, pY - pR * 0.3, 10, pX, pY, pR);
  planetGrad.addColorStop(0, '#60a5fa');
  planetGrad.addColorStop(0.6, '#1e3a8a');
  planetGrad.addColorStop(1, '#020617');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(pX, pY, pR, 0, Math.PI * 2);
  ctx.fill();

  // Planetary rings
  ctx.save();
  ctx.translate(pX, pY);
  ctx.rotate(-0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, pR * 2.2, pR * 0.45, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(191, 219, 254, 0.5)';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // Titanium deep space exploration probe / flagship silhouette
  const shipX = width * 0.65;
  const shipY = height * 0.6;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(shipX + 120, shipY);
  ctx.lineTo(shipX - 60, shipY - 35);
  ctx.lineTo(shipX - 40, shipY);
  ctx.lineTo(shipX - 60, shipY + 35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Engine exhaust plasma
  const plasmaGrad = ctx.createLinearGradient(shipX - 40, shipY, shipX - 120, shipY);
  plasmaGrad.addColorStop(0, '#38bdf8');
  plasmaGrad.addColorStop(0.7, '#818cf8');
  plasmaGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = plasmaGrad;
  ctx.beginPath();
  ctx.moveTo(shipX - 50, shipY - 12);
  ctx.lineTo(shipX - 110, shipY);
  ctx.lineTo(shipX - 50, shipY + 12);
  ctx.closePath();
  ctx.fill();
}

function drawAnimeScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Majestic stylized clouds (Makoto Shinkai aesthetic)
  const cloudCount = 6;
  for (let c = 0; c < cloudCount; c++) {
    const cx = (c / cloudCount) * width + width * 0.1;
    const cy = height * (0.2 + rng() * 0.35);
    const cr = Math.min(width, height) * (0.15 + rng() * 0.2);

    const cGrad = ctx.createRadialGradient(cx, cy - cr * 0.3, cr * 0.2, cx, cy, cr);
    cGrad.addColorStop(0, '#ffffff');
    cGrad.addColorStop(0.5, '#fbcfe8');
    cGrad.addColorStop(1, '#a855f7');

    ctx.fillStyle = cGrad;
    for (let p = 0; p < 5; p++) {
      ctx.beginPath();
      ctx.arc(cx + (p - 2) * (cr * 0.4), cy + (rng() - 0.5) * 20, cr * (0.5 + rng() * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Distant mountain ridge in cel-shade
  ctx.fillStyle = '#4338ca';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width * 0.25, height * 0.45);
  ctx.lineTo(width * 0.5, height * 0.65);
  ctx.lineTo(width * 0.8, height * 0.4);
  ctx.lineTo(width, height * 0.6);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // High-key sunburst rays
  ctx.save();
  const sunX = width * 0.82;
  const sunY = height * 0.25;
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.lineWidth = 14;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(a) * width, sunY + Math.sin(a) * width);
    ctx.stroke();
  }
  ctx.restore();

  // Floating sakura petals
  ctx.fillStyle = '#f472b6';
  for (let p = 0; p < 35; p++) {
    const px = rng() * width;
    const py = rng() * height;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rng() * Math.PI);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawOilPaintingScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Impasto textured brush stroke fields
  const strokeCount = 140;
  for (let i = 0; i < strokeCount; i++) {
    const sx = rng() * width;
    const sy = rng() * height;
    const len = width * (0.08 + rng() * 0.15);
    const angle = (rng() - 0.5) * 0.6;

    const colors = ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#451a03', '#1c1917'];
    ctx.strokeStyle = colors[Math.floor(rng() * colors.length)];
    ctx.lineWidth = 6 + rng() * 12;
    ctx.lineCap = 'round';

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, (rng() - 0.5) * 15);
    ctx.stroke();
    ctx.restore();
  }

  // Classical Chiaroscuro focal light
  const flX = width * 0.4;
  const flY = height * 0.4;
  const flR = Math.min(width, height) * 0.35;
  const flGrad = ctx.createRadialGradient(flX, flY, 10, flX, flY, flR);
  flGrad.addColorStop(0, 'rgba(254, 243, 199, 0.5)');
  flGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.25)');
  flGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = flGrad;
  ctx.fillRect(0, 0, width, height);
}

function draw3DScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Isometric stylized 3D cubes and glossy spheres
  const centerX = width * 0.5;
  const centerY = height * 0.55;
  const size = Math.min(width, height) * 0.22;

  // Pedestal base
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + size * 0.9, size * 1.4, size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Floating glossy 3D sphere with ambient occlusion & reflections
  const sphereX = centerX;
  const sphereY = centerY - size * 0.2;
  const sphereR = size * 0.65;

  const sGrad = ctx.createRadialGradient(
    sphereX - sphereR * 0.35,
    sphereY - sphereR * 0.35,
    sphereR * 0.1,
    sphereX,
    sphereY,
    sphereR
  );
  sGrad.addColorStop(0, '#c084fc');
  sGrad.addColorStop(0.3, '#818cf8');
  sGrad.addColorStop(0.8, '#312e81');
  sGrad.addColorStop(1, '#0f172a');

  ctx.fillStyle = sGrad;
  ctx.beginPath();
  ctx.arc(sphereX, sphereY, sphereR, 0, Math.PI * 2);
  ctx.fill();

  // Specular ring reflection
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sphereX - sphereR * 0.25, sphereY - sphereR * 0.25, sphereR * 0.3, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();

  // Orbiting crystalline glass rings
  ctx.save();
  ctx.translate(sphereX, sphereY);
  ctx.rotate(0.45);
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, sphereR * 1.6, sphereR * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMinimalistScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Pure geometric balance (Bauhaus / Golden ratio inspired)
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.28;

  // Solid dark circle
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx - width * 0.08, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Vibrant terracotta semi-circle
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(cx + width * 0.08, cy + height * 0.06, radius * 0.8, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();

  // Thin architectural alignment lines
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, cy);
  ctx.lineTo(width * 0.9, cy);
  ctx.moveTo(cx, height * 0.1);
  ctx.lineTo(cx, height * 0.9);
  ctx.stroke();

  // Golden accent dot
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(cx + width * 0.18, cy - height * 0.18, 14, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhotorealScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  accentColor: string
) {
  // Mountain silhouettes with atmospheric depth
  const layers = 4;
  for (let l = 0; l < layers; l++) {
    const factor = l / layers;
    const yBase = height * (0.45 + factor * 0.25);
    const alpha = 0.3 + factor * 0.7;

    ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, yBase);

    for (let x = 0; x <= width; x += width * 0.1) {
      const peak = yBase + (rng() - 0.5) * (height * 0.15 * (1 - factor * 0.5));
      ctx.lineTo(x, peak);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }

  // Bokeh optical discs
  for (let b = 0; b < 25; b++) {
    const bx = rng() * width;
    const by = rng() * height;
    const br = 8 + rng() * 32;

    const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    bGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
    bGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.1)');
    bGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
}

function applyLightingOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightingId: string,
  rng: () => number
) {
  ctx.save();
  if (lightingId === 'golden_hour') {
    const sunGrad = ctx.createRadialGradient(width * 0.2, height * 0.2, 20, width * 0.5, height * 0.5, width * 0.8);
    sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
    sunGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.15)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);
  } else if (lightingId === 'neon_night') {
    const neonGrad = ctx.createLinearGradient(0, 0, width, height);
    neonGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    neonGrad.addColorStop(1, 'rgba(217, 70, 239, 0.15)');
    ctx.fillStyle = neonGrad;
    ctx.fillRect(0, 0, width, height);
  } else if (lightingId === 'bioluminescent') {
    const bioGrad = ctx.createRadialGradient(width * 0.5, height * 0.7, 50, width * 0.5, height * 0.5, width * 0.6);
    bioGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    bioGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bioGrad;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

function applyTextureGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  styleId: string
) {
  // Vignette shadow on borders
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.45,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(2, 6, 23, 0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawArtisticBranding(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  styleName: string
) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '600 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`LUMINA AI • ${styleName.toUpperCase()}`, width - 24, height - 20);
  ctx.restore();
}
