import { expect, test } from '@playwright/test';

test('first scene renders and fills the screen', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('./');
  await page.waitForFunction(() => (window.__LAST_TRAIN__?.frames ?? 0) > 10, undefined, { timeout: 30_000 });

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const box = await page.locator('#game').boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round(box!.width)).toBe(viewport!.width);
  expect(Math.round(box!.height)).toBe(viewport!.height);

  await expect(page.getByTestId('fps')).toHaveText(/\d+ fps/);

  // The canvas must actually contain the scene, not a blank clear colour.
  await page.screenshot({ path: `screenshots/${testInfo.project.name}.png` });

  const stats = await page.evaluate(() => {
    const d = window.__LAST_TRAIN__!.sample(64);
    let dark = 0;
    let warm = 0;
    for (let i = 0; i < d.length; i += 4) {
      const [r, g, b] = [d[i]!, d[i + 1]!, d[i + 2]!];
      if (r + g + b < 120 && b >= r) dark++; // black-purple Dusk
      if (r > b + 30 && g > b) warm++; // golden world
    }
    return { dark, warm, total: Math.max(1, d.length / 4) };
  });
  expect(stats.dark / stats.total).toBeGreaterThan(0.03);
  expect(stats.warm / stats.total).toBeGreaterThan(0.4);

  expect(errors).toEqual([]);
});
