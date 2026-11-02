import { describe, expect, it } from 'vitest';
import {
  clampPixelRatio,
  duskEdgeOffset,
  fitFrustum,
  isoCameraOffset,
  shadowLength,
  sunDirection,
} from '../../src/core/isoView';
import scene from '../../src/data/scene.json';

describe('fitFrustum', () => {
  it('shows viewSize across the shorter side in portrait', () => {
    const f = fitFrustum(390, 844, 14);
    expect(f.right - f.left).toBeCloseTo(14, 6);
    expect((f.top - f.bottom) / (f.right - f.left)).toBeCloseTo(844 / 390, 6);
  });

  it('shows viewSize across the shorter side in landscape', () => {
    const f = fitFrustum(844, 390, 14);
    expect(f.top - f.bottom).toBeCloseTo(14, 6);
    expect((f.right - f.left) / (f.top - f.bottom)).toBeCloseTo(844 / 390, 6);
  });

  it('is centred', () => {
    const f = fitFrustum(800, 600, 10);
    expect(f.left).toBeCloseTo(-f.right);
    expect(f.bottom).toBeCloseTo(-f.top);
  });

  it('rejects zero sizes', () => {
    expect(() => fitFrustum(0, 100, 10)).toThrow(RangeError);
    expect(() => fitFrustum(100, 100, 0)).toThrow(RangeError);
  });
});

describe('isoCameraOffset', () => {
  it('true isometric angles give equal x, y, z offsets', () => {
    const o = isoCameraOffset(45, 35.264, 30);
    expect(o.x).toBeCloseTo(o.y, 2);
    expect(o.y).toBeCloseTo(o.z, 2);
    expect(Math.hypot(o.x, o.y, o.z)).toBeCloseTo(30, 6);
  });

  it('configured camera is above the ground', () => {
    const c = scene.camera;
    expect(isoCameraOffset(c.yawDeg, c.pitchDeg, c.distance).y).toBeGreaterThan(0);
  });
});

describe('sun', () => {
  it('direction is a unit vector', () => {
    const d = sunDirection(110, 14);
    expect(Math.hypot(d.x, d.y, d.z)).toBeCloseTo(1, 6);
  });

  it('low golden-hour sun casts shadows at least 3x the object height (style rule: long shadows)', () => {
    const { sunElevationDeg } = scene.lighting;
    expect(shadowLength(1, sunElevationDeg)).toBeGreaterThanOrEqual(3);
  });

  it('shadowLength rejects impossible elevations', () => {
    expect(() => shadowLength(1, 0)).toThrow(RangeError);
    expect(() => shadowLength(1, 90)).toThrow(RangeError);
  });
});

describe('clampPixelRatio', () => {
  it('caps high-DPI phones at the configured maximum', () => {
    expect(clampPixelRatio(3, scene.renderer.maxPixelRatio)).toBe(scene.renderer.maxPixelRatio);
    expect(clampPixelRatio(1, 1.5)).toBe(1);
    expect(clampPixelRatio(Number.NaN, 1.5)).toBe(1);
  });
});

describe('duskEdgeOffset', () => {
  it('keeps the Dusk visible on the left in portrait and landscape', () => {
    const { duskScreenFraction, duskMinVisibleWidth } = scene.world;
    for (const [w, h] of [
      [390, 844],
      [844, 390],
    ] as const) {
      const f = fitFrustum(w, h, scene.camera.viewSize);
      const edge = duskEdgeOffset(f, duskScreenFraction, duskMinVisibleWidth);
      expect(edge - f.left).toBeGreaterThanOrEqual(duskMinVisibleWidth - 1e-9);
      expect(edge).toBeLessThan(0); // stays on the left half, never covers the centre
    }
  });
});
