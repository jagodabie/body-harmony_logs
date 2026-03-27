import { test } from '@playwright/test';

test.describe('AddProduct', () => {
  test.describe('search by name', () => {
    test.skip('renders search input on page load', async () => {});
    test.skip('does not trigger search for fewer than 3 characters', async () => {});
    test.skip('shows search results after typing 3+ characters', async () => {});
    test.skip('result items display name, brand, and macros', async () => {});
    test.skip('clicking a result hides the list and shows ProductCard', async () => {});
    test.skip('clearing the input hides the results list', async () => {});
  });

  test.describe('search by barcode (text input)', () => {
    test.skip('typing a valid EAN triggers product lookup', async () => {});
    test.skip('invalid EAN format shows a warning snackbar', async () => {});
    test.skip('successful EAN lookup opens ProductCard', async () => {});
  });

  test.describe('ProductCard', () => {
    test.skip('displays product name, brand, and nutrients per 100 g', async () => {});
    test.skip('weight input recalculates displayed macros', async () => {});
    test.skip('saving with a valid weight adds product to meal and navigates back', async () => {});
    test.skip('save button is disabled when weight input is empty or invalid', async () => {});
  });
});
