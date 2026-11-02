import * as THREE from 'three';
import type { SceneConfig } from '../core/config';

/**
 * Placeholder Dusk: a black-purple field with a wavering, faintly glowing edge.
 * The ONLY cold colour in the game. Owns the one real-time light (a pulsing violet glow).
 */
export class DuskStrip {
  readonly group = new THREE.Group();
  private readonly material: THREE.ShaderMaterial;
  private readonly light: THREE.PointLight;
  private readonly baseLightIntensity: number;

  constructor(cfg: SceneConfig) {
    const { palette, world, lighting, camera } = cfg;
    const length = world.groundSize * 1.5;
    const glowSpill = world.duskEdgeWidth * 3;

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uCore: { value: new THREE.Color(palette.duskCore) },
        uBody: { value: new THREE.Color(palette.duskBody) },
        uGlow: { value: new THREE.Color(palette.duskEdgeGlow) },
        uEdgeWidth: { value: world.duskEdgeWidth },
      },
      vertexShader: /* glsl */ `
        varying vec2 vPos;
        void main() {
          vPos = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uCore;
        uniform vec3 uBody;
        uniform vec3 uGlow;
        uniform float uEdgeWidth;
        varying vec2 vPos;
        void main() {
          float z = vPos.y;
          // Slow, breathing edge: a few sine layers read as a living mass, cheap on mobile GPUs.
          float wave = sin(z * 0.38 + uTime * 0.35) * 0.6
                     + sin(z * 0.93 - uTime * 0.55) * 0.3
                     + sin(z * 2.3 + uTime * 0.9) * 0.07;
          float d = vPos.x - wave;            // < 0 inside the Dusk, > 0 outside
          float inside = 1.0 - smoothstep(-0.15, 0.15, d);
          float depth = smoothstep(0.0, 7.0, -d);
          vec3 body = mix(uBody, uCore, depth);
          float rim = exp(-abs(d) / (uEdgeWidth * 0.35));
          vec3 color = body + uGlow * rim * 0.55;
          float spill = exp(-max(d, 0.0) / (uEdgeWidth * 0.6)) * 0.35;  // faint cold haze leaking onto the world
          float alpha = max(inside, spill * (0.6 + 0.4 * rim));
          gl_FragColor = vec4(mix(uGlow * 0.6 + uBody * 0.4, color, inside), alpha);
        }
      `,
    });

    // Plane in local XY, laid flat: local +X = towards the world, local Y = along the edge.
    const width = world.duskDepth + glowSpill;
    const geo = new THREE.PlaneGeometry(width, length, 1, 1);
    geo.translate(-world.duskDepth / 2 + glowSpill / 2, 0, 0);
    const plane = new THREE.Mesh(geo, this.material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.04;
    plane.renderOrder = 10;
    this.group.add(plane);

    this.light = new THREE.PointLight(palette.duskLight, lighting.duskLightIntensity, lighting.duskLightDistance, 1.6);
    this.light.position.set(0.6, 1.2, 0);
    this.baseLightIntensity = lighting.duskLightIntensity;
    this.group.add(this.light);

    // Align with the screen: the edge runs straight up the screen, the Dusk fills the left side.
    this.group.rotation.y = (camera.yawDeg * Math.PI) / 180;
  }

  /** Place the edge `offset` world units right of the view centre (negative = left). */
  setScreenOffset(offset: number): void {
    const yaw = this.group.rotation.y;
    this.group.position.set(Math.cos(yaw) * offset, 0, -Math.sin(yaw) * offset);
  }

  update(timeSec: number, cfg: SceneConfig): void {
    this.material.uniforms['uTime']!.value = timeSec;
    const { duskPulseSpeed, duskPulseAmount } = cfg.lighting;
    this.light.intensity =
      this.baseLightIntensity * (1 + Math.sin(timeSec * duskPulseSpeed * Math.PI * 2) * duskPulseAmount);
  }
}
