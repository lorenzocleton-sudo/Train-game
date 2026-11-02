/**
 * Rolling-average frames-per-second meter. Pure logic, no DOM, no Three.js.
 * Feed it frame durations in milliseconds; read `fps` for the smoothed value.
 */
export class FpsMeter {
  private readonly samples: number[] = [];
  private sum = 0;

  constructor(private readonly windowSize: number) {
    if (!Number.isInteger(windowSize) || windowSize < 1) {
      throw new RangeError(`FpsMeter windowSize must be a positive integer, got ${windowSize}`);
    }
  }

  /** Record one frame. Non-finite or non-positive durations are ignored (tab switches, clock hiccups). */
  push(frameMs: number): void {
    if (!Number.isFinite(frameMs) || frameMs <= 0) return;
    this.samples.push(frameMs);
    this.sum += frameMs;
    if (this.samples.length > this.windowSize) {
      this.sum -= this.samples.shift() ?? 0;
    }
  }

  /** Average fps over the window, or 0 before any frame was recorded. */
  get fps(): number {
    if (this.samples.length === 0) return 0;
    return 1000 / (this.sum / this.samples.length);
  }

  get sampleCount(): number {
    return this.samples.length;
  }

  reset(): void {
    this.samples.length = 0;
    this.sum = 0;
  }
}
