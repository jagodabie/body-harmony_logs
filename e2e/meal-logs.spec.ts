import { expect, test } from '@playwright/test';

const MEALS_API_PATTERN = '**/api/meals/by-date/**';
const DELETE_PRODUCT_PATTERN = '**/api/meals/*/products/*';
const ADD_PRODUCT_PATTERN = '**/api/meals/*/products';
const PRODUCTS_SEARCH_PATTERN = '**/api/products/search*';

const emptyMealsResponse = {
  date: '2026-03-26',
  meals: [],
  dailyTotals: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
};

const mealsWithDataResponse = {
  date: '2026-03-26',
  meals: [
    {
      id: 'meal-breakfast-1',
      name: 'BREAKFAST',
      mealType: 'BREAKFAST',
      date: '2026-03-26T00:00:00.000Z',
      time: '08:00',
      notes: null,
      createdAt: '2026-03-26T08:00:00.000Z',
      updatedAt: '2026-03-26T08:00:00.000Z',
      macros: { calories: 450, proteins: 30, carbs: 50, fat: 15 },
      products: [
        {
          id: 'product-1',
          mealId: 'meal-breakfast-1',
          productCode: '3017624010701',
          name: 'Nutella',
          brands: 'Ferrero',
          quantity: 100,
          unit: 'g',
          nutrientsPer100g: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
          nutrientsPerPortion: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
        },
      ],
    },
  ],
  dailyTotals: { calories: 450, proteins: 30, carbs: 50, fat: 15 },
};

const mealsAfterDeleteResponse = {
  date: '2026-03-26',
  meals: [
    {
      id: 'meal-breakfast-1',
      name: 'BREAKFAST',
      mealType: 'BREAKFAST',
      date: '2026-03-26T00:00:00.000Z',
      time: '08:00',
      notes: null,
      createdAt: '2026-03-26T08:00:00.000Z',
      updatedAt: '2026-03-26T08:00:00.000Z',
      macros: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
      products: [],
    },
  ],
  dailyTotals: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
};

const mealsAfterAddResponse = {
  date: '2026-03-26',
  meals: [
    {
      id: 'meal-breakfast-1',
      name: 'BREAKFAST',
      mealType: 'BREAKFAST',
      date: '2026-03-26T00:00:00.000Z',
      time: '08:00',
      notes: null,
      createdAt: '2026-03-26T08:00:00.000Z',
      updatedAt: '2026-03-26T08:00:00.000Z',
      macros: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
      products: [
        {
          id: 'product-2',
          mealId: 'meal-breakfast-1',
          productCode: '3017624010701',
          name: 'Nutella',
          brands: 'Ferrero',
          quantity: 100,
          unit: 'g',
          nutrientsPer100g: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
          nutrientsPerPortion: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
        },
      ],
    },
  ],
  dailyTotals: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
};

const productSearchResponse = [
  {
    id: 'product-db-1',
    code: '3017624010701',
    name: 'Nutella',
    brands: 'Ferrero',
    countries_tags: [],
    nutriscore: 'e',
    allergens: [],
    nutrientsPer100g: { calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9 },
    quantity: 400,
  },
];

const mealsNoTotalsResponse = {
  date: '2026-03-26',
  meals: [],
  dailyTotals: null,
};

const formatExpectedDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day} ${month} ${year}`;
};

test.describe('MealLogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('meal-logs-storage');
    });
  });

  test('shows today\'s date in DateMenu on initial load', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: emptyMealsResponse })
    );

    await page.goto('/meal-logs');

    const today = new Date();
    const expectedDate = formatExpectedDate(today);
    await expect(page.locator('.date-menu h3')).toHaveText(expectedDate);
  });

  test('clicking prev arrow decrements the displayed date', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: emptyMealsResponse })
    );

    await page.goto('/meal-logs');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const expectedDate = formatExpectedDate(yesterday);

    await page.locator('.date-menu__arrow-left').click();

    await expect(page.locator('.date-menu h3')).toHaveText(expectedDate);
  });

  test('clicking next arrow increments the displayed date', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: emptyMealsResponse })
    );

    await page.goto('/meal-logs');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDate = formatExpectedDate(tomorrow);

    await page.locator('.date-menu__arrow-right').click();

    await expect(page.locator('.date-menu h3')).toHaveText(expectedDate);
  });

  test('loads and displays meals for the current date', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    await expect(page.locator('.meal__header-title', { hasText: 'BREAKFAST' })).toBeVisible();
    await expect(page.locator('.meal__header-title', { hasText: 'LUNCH' })).toBeVisible();
    await expect(page.locator('.meal__header-title', { hasText: 'DINNER' })).toBeVisible();
    await expect(page.locator('.meal__header-title', { hasText: 'SNACK' })).toBeVisible();
  });

  test('shows empty state when no meals are returned for the day', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: emptyMealsResponse })
    );

    await page.goto('/meal-logs');

    const mealTitles = page.locator('.meal__header-title');
    await expect(mealTitles).toHaveCount(4);
    await expect(mealTitles.nth(0)).toHaveText('BREAKFAST');
    await expect(mealTitles.nth(1)).toHaveText('LUNCH');
    await expect(mealTitles.nth(2)).toHaveText('DINNER');
    await expect(mealTitles.nth(3)).toHaveText('SNACK');
  });

  test('shows CalorieProgressBar when dailyTotals are present', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    await expect(page.locator('.calorie-bar')).toBeVisible();
    await expect(page.locator('.calorie-bar__calories-consumed')).toHaveText('450 kcal');
  });
  test('shows CalorieProgressBar with zeros when dailyTotals are absent', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsNoTotalsResponse })
    );

    await page.goto('/meal-logs');

    await expect(page.locator('.calorie-bar')).toBeVisible();
    await expect(page.locator('.calorie-bar__calories-consumed')).toHaveText('0 kcal');
  });

  test('clicking "Add product" inside a meal navigates to /add-product/:mealId', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    const breakfastMeal = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfastMeal.locator('.meal__header-actions button').click();

    await expect(page).toHaveURL(/\/add-product\/meal-breakfast-1/);
  });

  test('shows products list when meal is expanded', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-expand-button').click();

    await expect(breakfast.locator('.meal-product__name')).toHaveText('Nutella');
    await expect(breakfast.locator('.meal-product__quantity')).toHaveText('100 g');
  });

  test('meal header macros reflect API response', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    const breakfastMacros = page
      .locator('.meal', { hasText: 'BREAKFAST' })
      .first()
      .locator('.meal__header-macros');

    await expect(breakfastMacros.locator('.macros__calories')).toHaveText('450 kcal');
    await expect(breakfastMacros.locator('.macros__protein')).toHaveText('Protein: 30 g');
    await expect(breakfastMacros.locator('.macros__carbohydrates')).toHaveText('Carbs: 50 g');
    await expect(breakfastMacros.locator('.macros__fat')).toHaveText('Fat: 15 g');
  });

  test('product macros match nutrientsPer100g from API', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-expand-button').click();

    const productMacros = breakfast.locator('.meal-product').first().locator('.macros');
    await expect(productMacros.locator('.macros__calories')).toHaveText('539 kcal');
    await expect(productMacros.locator('.macros__protein')).toHaveText('Protein: 6.3 g');
    await expect(productMacros.locator('.macros__carbohydrates')).toHaveText('Carbs: 57.5 g');
    await expect(productMacros.locator('.macros__fat')).toHaveText('Fat: 30.9 g');
  });

  test('removes product from meal after clicking delete', async ({ page }) => {
    let productDeleted = false;

    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: productDeleted ? mealsAfterDeleteResponse : mealsWithDataResponse })
    );

    await page.route(DELETE_PRODUCT_PATTERN, async route => {
      if (route.request().method() === 'DELETE') {
        productDeleted = true;
        await route.fulfill({ status: 200 });
      } else {
        await route.continue();
      }
    });

    await page.goto('/meal-logs');

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-expand-button').click();
    await expect(breakfast.locator('.meal-product__name')).toHaveText('Nutella');

    await breakfast.locator('.meal-product__delete button').click();

    await expect(breakfast.locator('.meal-product')).toHaveCount(0);
  });

  test('meal macros update to zero after product is deleted', async ({ page }) => {
    let productDeleted = false;

    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: productDeleted ? mealsAfterDeleteResponse : mealsWithDataResponse })
    );

    await page.route(DELETE_PRODUCT_PATTERN, async route => {
      if (route.request().method() === 'DELETE') {
        productDeleted = true;
        await route.fulfill({ status: 200 });
      } else {
        await route.continue();
      }
    });

    await page.goto('/meal-logs');

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-expand-button').click();
    await breakfast.locator('.meal-product__delete button').click();

    const breakfastMacros = breakfast.locator('.meal__header-macros');
    await expect(breakfastMacros.locator('.macros__calories')).toHaveText('0 kcal');
    await expect(breakfastMacros.locator('.macros__protein')).toHaveText('Protein: 0 g');
  });

  test('add product flow: search, select, add, navigate back to meal-logs', async ({ page }) => {
    let productAdded = false;

    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: productAdded ? mealsAfterAddResponse : mealsWithDataResponse })
    );

    await page.route(PRODUCTS_SEARCH_PATTERN, route =>
      route.fulfill({ json: productSearchResponse })
    );

    await page.route(ADD_PRODUCT_PATTERN, async route => {
      if (route.request().method() === 'POST') {
        productAdded = true;
        await route.fulfill({ status: 200, json: {} });
      } else {
        await route.continue();
      }
    });

    // Load meals into store first so the add-product hook can find the meal
    await page.goto('/meal-logs');
    await expect(page.locator('.meal__header-title', { hasText: 'BREAKFAST' })).toBeVisible();

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-actions button').click();
    await expect(page).toHaveURL(/\/add-product\/meal-breakfast-1/);

    // Search for product by name
    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill('Nutella');
    await expect(page.locator('.add-product__item-name', { hasText: 'Nutella' })).toBeVisible();

    // Select the product from search results
    await page.locator('.add-product__item', { hasText: 'Nutella' }).click();

    // ProductCard should appear — click per 100g option
    const per100gOption = page.locator('.product-card__kcal-list-item', { hasText: 'per 100g' });
    await expect(per100gOption).toBeVisible();

    const addRequest = page.waitForRequest(req =>
      req.url().includes('/api/meals/meal-breakfast-1/products') && req.method() === 'POST'
    );
    await per100gOption.locator('.product-card__quantity-button button').click();
    await addRequest;

    await expect(page).toHaveURL(/\/meal-logs/);
  });

  test('collapses meal after clicking expand twice', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    const breakfast = page.locator('.meal', { hasText: 'BREAKFAST' }).first();
    await breakfast.locator('.meal__header-expand-button').click();
    await expect(breakfast.locator('.meal__body')).toHaveClass(/meal__body--expanded/);

    await breakfast.locator('.meal__header-expand-button').click();
    await expect(breakfast.locator('.meal__body')).not.toHaveClass(/meal__body--expanded/);
  });

  test('expand button is disabled when meal has no products', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: emptyMealsResponse })
    );

    await page.goto('/meal-logs');

    await expect(page.locator('.meal__header-expand-button').first()).toBeDisabled();
  });

  test('CalorieProgressBar shows proteins, carbs and fat values', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );

    await page.goto('/meal-logs');

    await expect(page.locator('.macro-bar', { hasText: 'Protein' }).locator('.macro-bar__value')).toHaveText('30/110g');
    await expect(page.locator('.macro-bar', { hasText: 'Fat' }).locator('.macro-bar__value')).toHaveText('15/73g');
    await expect(page.locator('.macro-bar', { hasText: 'Carbs' }).locator('.macro-bar__value')).toHaveText('50/384g');
  });

  test('shows no results when name search returns empty array', async ({ page }) => {
    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );
    await page.route(PRODUCTS_SEARCH_PATTERN, route =>
      route.fulfill({ json: [] })
    );

    await page.goto('/meal-logs');
    await page.locator('.meal', { hasText: 'BREAKFAST' }).first().locator('.meal__header-actions button').click();

    await page.locator('input[name="search"]').fill('nieistniejącyprodukxyz');
    await page.waitForResponse(PRODUCTS_SEARCH_PATTERN);

    await expect(page.locator('.add-product__list')).not.toBeAttached();
  });

  test('shows error message when EAN barcode is not found', async ({ page }) => {
    const EAN = '3017624010701';

    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: mealsWithDataResponse })
    );
    await page.route(`**/api/products/${EAN}`, route =>
      route.fulfill({ status: 404, json: { error: 'Product not found' } })
    );

    await page.goto('/meal-logs');
    await page.locator('.meal', { hasText: 'BREAKFAST' }).first().locator('.meal__header-actions button').click();

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill(EAN);
    await searchInput.press('Enter');

    await expect(page.locator('.add-product__message[role="alert"]')).toBeVisible();
    await expect(page.locator('.add-product__message[role="alert"]')).toHaveText('Product not found');
  });

  test('adds product with custom quantity input', async ({ page }) => {
    let productAdded = false;

    await page.route(MEALS_API_PATTERN, route =>
      route.fulfill({ json: productAdded ? mealsAfterAddResponse : mealsWithDataResponse })
    );
    await page.route(PRODUCTS_SEARCH_PATTERN, route =>
      route.fulfill({ json: productSearchResponse })
    );
    await page.route(ADD_PRODUCT_PATTERN, async route => {
      if (route.request().method() === 'POST') {
        productAdded = true;
        await route.fulfill({ status: 200, json: {} });
      } else {
        await route.continue();
      }
    });

    await page.goto('/meal-logs');
    await page.locator('.meal', { hasText: 'BREAKFAST' }).first().locator('.meal__header-actions button').click();

    await page.locator('input[name="search"]').fill('Nutella');
    await page.locator('.add-product__item', { hasText: 'Nutella' }).click();

    await page.locator('input[name="quantity"]').fill('200');

    const addRequest = page.waitForRequest(req =>
      req.url().includes('/api/meals/meal-breakfast-1/products') && req.method() === 'POST'
    );
    await page.locator('.product-card__quantity').locator('.product-card__quantity-button button').click();
    await addRequest;

    await expect(page).toHaveURL(/\/meal-logs/);
  });

});
