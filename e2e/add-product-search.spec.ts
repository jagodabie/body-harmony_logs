import { expect, test } from '@playwright/test';

const MOCK_PRODUCT = {
  id: 'product-abc123',
  name: 'Chicken Breast',
  brands: 'FreshFarm',
  nutrientsPer100g: {
    calories: 165,
    proteins: 31,
    carbs: 0,
    fat: 3.6,
  },
};

test.describe('AddProduct — search by name', () => {
  test('shows results after typing a query and navigates to product card on click', async ({
    page,
  }) => {
    // Mock API — intercept any products/search call regardless of base URL
    await page.route('**/products/search**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_PRODUCT]),
      });
    });

    await page.goto('/add-product/test-meal-123');

    // Type a query (min. 3 chars, not digits-only — condition in useDebouncedSearch)
    const input = page.getByRole('textbox', {
      name: /search products by name or barcode/i,
    });
    await input.fill('chicken');

    // Wait for results
    const resultItem = page.locator('.add-product__item-name', {
      hasText: 'Chicken Breast',
    });
    await expect(resultItem).toBeVisible();

    // Check brand and macros in the list
    await expect(page.locator('.add-product__item-brand')).toHaveText('FreshFarm');
    await expect(page.locator('.add-product__item-macros-row').first()).toContainText(
      '165 kcal'
    );

    // Click product — ProductCard should open
    await resultItem.click();

    // Results list should disappear
    await expect(page.locator('.add-product__list')).not.toBeVisible();
  });
});
