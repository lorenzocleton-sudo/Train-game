import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { SceneConfig } from '../core/config';
import { clampPixelRatio, duskEdgeOffset, fitFrustum, isoCameraOffset, sunDirection } from '../core/isoView';
import { DuskStrip } from './dusk';
import { paintedTexture } from './paintedTexture';

/**
 * First scene: painted ground, a softly bevelled cube, a fixed isometric camera,
 * golden low sun with a long (baked-once) shadow, warm haze and the Dusk placeholder.
 */
export class FirstScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.OrthographicCamera;
  private readonly dusk: DuskStrip;

  constructor(private readonly canvas: HTMLCanvasElement, private readonly cfg: SceneConfig) {
    const { palette, renderer: rc, camera: cc, lighting, fog, world } = cfg;
    const dpr = clampPixelRatio(window.devicePixelRatio, rc.maxPixelRatio);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio < rc.antialiasBelowPixelRatio,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    // Shadows are "baked": rendered once, never updated per frame (static scene, budget phones).
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;

    this.scene.background = new THREE.Color(palette.haze);
    this.scene.fog = new THREE.Fog(palette.haze, fog.near, fog.far);

    // Camera
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, cc.near, cc.far);
    const off = isoCameraOffset(cc.yawDeg, cc.pitchDeg, cc.distance);
    this.camera.position.set(off.x, off.y, off.z);
    this.camera.lookAt(0, 0, 0);

    // Lights: soft warm sky fill + low golden sun.
    this.scene.add(new THREE.HemisphereLight(palette.skyLight, palette.groundBounce, lighting.hemiIntensity));
    const sun = new THREE.DirectionalLight(palette.sun, lighting.sunIntensity);
    const sd = sunDirection(lighting.sunAzimuthDeg, lighting.sunElevationDeg);
    sun.position.set(sd.x * 30, sd.y * 30, sd.z * 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(rc.shadowMapSize, rc.shadowMapSize);
    const sc = sun.shadow.camera;
    sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 70;
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 4;
    this.scene.add(sun, sun.target);

    // Ground
    const groundTex = paintedTexture({
      size: world.groundTextureSize,
      base: palette.groundBase,
      strokes: palette.groundStrokes,
      strokeCount: world.groundStrokeCount,
      blotchCount: 22,
      blotchColors: palette.groundBlotches,
      strokeAlpha: 0.22,
      minLength: 10,
      maxLength: 34,
      seed: 7,
    });
    groundTex.repeat.set(world.groundSize / 12, world.groundSize / 12);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(world.groundSize, world.groundSize),
      new THREE.MeshLambertMaterial({ map: groundTex }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cube with soft bevels and painted rust.
    const cubeTex = paintedTexture({
      size: 256,
      base: palette.cube,
      strokes: palette.cubeStrokes,
      strokeCount: 40,
      blotchCount: 8,
      blotchColors: palette.cubeStrokes,
      strokeAlpha: 0.25,
      minLength: 30,
      maxLength: 90,
      seed: 11,
    });
    const cube = new THREE.Mesh(
      new RoundedBoxGeometry(world.cubeSize, world.cubeSize, world.cubeSize, world.cubeBevelSegments, world.cubeBevelRadius),
      new THREE.MeshLambertMaterial({ map: cubeTex }),
    );
    cube.position.y = world.cubeSize / 2;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);

    // The Dusk
    this.dusk = new DuskStrip(cfg);
    this.scene.add(this.dusk.group);

    this.renderer.shadowMap.needsUpdate = true;
  }

  resize(width: number, height: number): void {
    const { camera: cc, world } = this.cfg;
    this.renderer.setSize(width, height, false);
    const f = fitFrustum(width, height, cc.viewSize);
    this.camera.left = f.left;
    this.camera.right = f.right;
    this.camera.top = f.top;
    this.camera.bottom = f.bottom;
    this.camera.updateProjectionMatrix();
    this.dusk.setScreenOffset(duskEdgeOffset(f, world.duskScreenFraction, world.duskMinVisibleWidth));
  }

  render(timeSec: number): void {
    this.dusk.update(timeSec, this.cfg);
    this.renderer.render(this.scene, this.camera);
  }

  get canvasElement(): HTMLCanvasElement {
    return this.canvas;
  }
}
