import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders app header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Body Harmony Logs', exact: true })).toBeVisible();
  });

  test('renders welcome heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Body Harmony Logs' })).toBeVisible();
  });

  test('renders navigation bar in footer', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /meals/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /logs/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /more/i })).toBeVisible();
  });

  test('dashboard nav item is active on /', async ({ page }) => {
    const dashboardBtn = page.getByRole('button', { name: /dashboard/i });
    await expect(dashboardBtn).toHaveClass(/active/);
  });

  test('bottom nav navigates to /meal-logs', async ({ page }) => {
    await page.getByRole('button', { name: /meals/i }).click();
    await expect(page).toHaveURL('/meal-logs');
  });

  test('bottom nav navigates to /logs', async ({ page }) => {
    await page.getByRole('button', { name: /logs/i }).click();
    await expect(page).toHaveURL('/logs');
  });
});
