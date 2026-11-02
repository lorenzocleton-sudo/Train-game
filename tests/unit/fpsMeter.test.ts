import { describe, expect, it } from 'vitest';
import { FpsMeter } from '../../src/core/fpsMeter';

describe('FpsMeter', () => {
  it('reports 0 before any frame', () => {
    expect(new FpsMeter(10).fps).toBe(0);
  });

  it('averages frame times into fps', () => {
    const m = new FpsMeter(4);
    for (let i = 0; i < 4; i++) m.push(1000 / 30);
    expect(m.fps).toBeCloseTo(30, 5);
  });

  it('keeps only the last windowSize samples', () => {
    const m = new FpsMeter(3);
    m.push(100); // 10 fps, should fall out of the window
    m.push(1000 / 60);
    m.push(1000 / 60);
    m.push(1000 / 60);
    expect(m.sampleCount).toBe(3);
    expect(m.fps).toBeCloseTo(60, 5);
  });

  it('ignores non-positive and non-finite durations', () => {
    const m = new FpsMeter(5);
    m.push(0);
    m.push(-5);
    m.push(Number.NaN);
    m.push(Number.POSITIVE_INFINITY);
    expect(m.sampleCount).toBe(0);
    m.push(20);
    expect(m.fps).toBeCloseTo(50, 5);
  });

  it('reset clears all samples', () => {
    const m = new FpsMeter(5);
    m.push(16);
    m.reset();
    expect(m.fps).toBe(0);
  });

  it('rejects an invalid window size', () => {
    expect(() => new FpsMeter(0)).toThrow(RangeError);
    expect(() => new FpsMeter(2.5)).toThrow(RangeError);
  });
});
