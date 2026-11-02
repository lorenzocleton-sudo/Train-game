import * as THREE from 'three';

/**
 * Procedural "hand-painted" texture: a flat base colour with broad, soft brush strokes.
 * Stand-in until the real .glb asset pack arrives; keeps the look painterly, never photographic.
 */
export interface PaintOptions {
  size: number;
  base: string;
  strokes: readonly string[];
  strokeCount: number;
  /** Large soft colour patches painted under the strokes (broad-brush variation). */
  blotchCount: number;
  blotchColors: readonly string[];
  /** Max stroke opacity; keep low for a calm, faded surface. */
  strokeAlpha: number;
  /** Stroke length range in pixels. */
  minLength: number;
  maxLength: number;
  seed: number;
}

/** Small deterministic PRNG so the scene looks identical on every load (stable screenshots). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function paintedTexture(opts: PaintOptions): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = opts.size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  const rand = mulberry32(opts.seed);

  ctx.fillStyle = opts.base;
  ctx.fillRect(0, 0, opts.size, opts.size);
  ctx.lineCap = 'round';

  const wrapped = (draw: (ox: number, oy: number) => void): void => {
    for (const ox of [-opts.size, 0, opts.size]) for (const oy of [-opts.size, 0, opts.size]) draw(ox, oy);
  };

  for (let i = 0; i < opts.blotchCount; i++) {
    const color = opts.blotchColors[Math.floor(rand() * opts.blotchColors.length)] ?? opts.base;
    const x = rand() * opts.size;
    const y = rand() * opts.size;
    const r = opts.size * (0.12 + rand() * 0.22);
    wrapped((ox, oy) => {
      const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
    });
  }

  for (let i = 0; i < opts.strokeCount; i++) {
    const color = opts.strokes[Math.floor(rand() * opts.strokes.length)] ?? opts.base;
    const len = opts.minLength + rand() * (opts.maxLength - opts.minLength);
    const angle = rand() * Math.PI;
    const x = rand() * opts.size;
    const y = rand() * opts.size;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opts.strokeAlpha * (0.4 + rand() * 0.6);
    ctx.lineWidth = len * (0.2 + rand() * 0.2);
    const dx = Math.cos(angle) * len * 0.5;
    const dy = Math.sin(angle) * len * 0.5;
    // Draw wrapped copies so the texture tiles seamlessly.
    wrapped((ox, oy) => {
      ctx.beginPath();
      ctx.moveTo(x - dx + ox, y - dy + oy);
      ctx.lineTo(x + dx + ox, y + dy + oy);
      ctx.stroke();
    });
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 2;
  return tex;
}
