import scene from '../data/scene.json';

/** Typed access to tuning data. All numbers live in src/data/*.json. */
export type SceneConfig = typeof scene;
export const sceneConfig: SceneConfig = scene;
