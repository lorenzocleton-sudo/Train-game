import './style.css';
import { sceneConfig } from './core/config';
import { FirstScene } from './render/scene';
import { FpsCounter } from './ui/fpsCounter';

interface DebugHandle {
  ready: boolean;
  frames: number;
  fps: number;
  size: { width: number; height: number };
  /** Renders a frame and returns it downscaled to size x size RGBA (for automated visual checks). */
  sample: (size: number) => number[];
}

declare global {
  interface Window {
    __LAST_TRAIN__?: DebugHandle;
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('#game');
const hud = document.querySelector<HTMLElement>('#hud');
if (!canvas || !hud) throw new Error('Missing #game canvas or #hud');

const game = new FirstScene(canvas, sceneConfig);
const fps = new FpsCounter(hud, sceneConfig.debug.fpsSampleWindow, sceneConfig.debug.fpsUpdateIntervalMs);
const debug: DebugHandle = {
  ready: false,
  frames: 0,
  fps: 0,
  size: { width: 0, height: 0 },
  sample: (size) => {
    // Read back in the same task as the render, before the drawing buffer is cleared.
    game.render(performance.now() / 1000);
    const tmp = document.createElement('canvas');
    tmp.width = tmp.height = size;
    const ctx = tmp.getContext('2d');
    if (!ctx) return [];
    ctx.drawImage(canvas, 0, 0, size, size);
    return Array.from(ctx.getImageData(0, 0, size, size).data);
  },
};
window.__LAST_TRAIN__ = debug;

function viewportSize(): { width: number; height: number } {
  const vv = window.visualViewport;
  return {
    width: Math.max(1, Math.round(vv?.width ?? window.innerWidth)),
    height: Math.max(1, Math.round(vv?.height ?? window.innerHeight)),
  };
}

function resize(): void {
  const size = viewportSize();
  debug.size = size;
  game.resize(size.width, size.height);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
window.visualViewport?.addEventListener('resize', resize);
resize();

let last = performance.now();
function tick(now: number): void {
  const dt = now - last;
  last = now;
  fps.frame(dt, now);
  game.render(now / 1000);
  debug.frames++;
  debug.fps = fps.fps;
  debug.ready = true;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
