import { test, expect } from '@playwright/test';

test('dashboard renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Saldo total')).toBeVisible();
  await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true });
});
