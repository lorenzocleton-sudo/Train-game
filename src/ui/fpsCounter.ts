import { FpsMeter } from '../core/fpsMeter';

/** Small fps readout, top-left, warm cream on a dark translucent panel. */
export class FpsCounter {
  readonly el: HTMLDivElement;
  private readonly meter: FpsMeter;
  private lastUpdate = 0;

  constructor(parent: HTMLElement, windowSize: number, private readonly updateIntervalMs: number) {
    this.meter = new FpsMeter(windowSize);
    this.el = document.createElement('div');
    this.el.className = 'hud-panel fps-counter';
    this.el.setAttribute('data-testid', 'fps');
    this.el.textContent = '-- fps';
    parent.appendChild(this.el);
  }

  frame(frameMs: number, nowMs: number): void {
    this.meter.push(frameMs);
    if (nowMs - this.lastUpdate >= this.updateIntervalMs) {
      this.lastUpdate = nowMs;
      this.el.textContent = `${Math.round(this.meter.fps)} fps`;
    }
  }

  get fps(): number {
    return this.meter.fps;
  }
}
