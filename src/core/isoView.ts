/**
 * Isometric view maths. Pure functions, no Three.js.
 */

export interface Frustum {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Orthographic frustum that always shows at least `viewSize` world units across
 * the shorter screen side, so the scene fills the screen in portrait and landscape
 * without stretching.
 */
export function fitFrustum(width: number, height: number, viewSize: number): Frustum {
  if (!(width > 0) || !(height > 0)) {
    throw new RangeError(`fitFrustum needs a positive size, got ${width}x${height}`);
  }
  if (!(viewSize > 0)) throw new RangeError(`viewSize must be positive, got ${viewSize}`);
  const aspect = width / height;
  const half = viewSize / 2;
  const halfW = aspect >= 1 ? half * aspect : half;
  const halfH = aspect >= 1 ? half : half / aspect;
  return { left: -halfW, right: halfW, top: halfH, bottom: -halfH };
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Camera offset from its target for a given yaw/pitch (degrees) and distance. */
export function isoCameraOffset(yawDeg: number, pitchDeg: number, distance: number): Vec3 {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const flat = Math.cos(pitch) * distance;
  return {
    x: Math.sin(yaw) * flat,
    y: Math.sin(pitch) * distance,
    z: Math.cos(yaw) * flat,
  };
}

/** Unit direction pointing from the ground towards the sun. */
export function sunDirection(azimuthDeg: number, elevationDeg: number): Vec3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return {
    x: Math.sin(az) * Math.cos(el),
    y: Math.sin(el),
    z: Math.cos(az) * Math.cos(el),
  };
}

/** Length of the shadow cast on flat ground by an object of `height` under a sun at `elevationDeg`. */
export function shadowLength(height: number, elevationDeg: number): number {
  if (!(elevationDeg > 0 && elevationDeg < 90)) {
    throw new RangeError(`sun elevation must be between 0 and 90 degrees, got ${elevationDeg}`);
  }
  return height / Math.tan((elevationDeg * Math.PI) / 180);
}

/** Render pixel ratio, capped for budget phones. */
export function clampPixelRatio(deviceRatio: number, maxRatio: number): number {
  if (!(deviceRatio > 0)) return 1;
  return Math.min(deviceRatio, maxRatio);
}

/**
 * Horizontal screen-space position (world units from the view centre) of the placeholder Dusk edge:
 * a fixed fraction of the visible width in from the left, but never less than `minVisible` units.
 */
export function duskEdgeOffset(frustum: Frustum, fraction: number, minVisible: number): number {
  const width = frustum.right - frustum.left;
  return frustum.left + Math.max(width * fraction, minVisible);
}
