import { test } from '@playwright/test';

test.describe('MealLogs', () => {
  test.skip('shows today\'s date in DateMenu on initial load', async () => {});
  test.skip('clicking prev arrow decrements the displayed date', async () => {});
  test.skip('clicking next arrow increments the displayed date', async () => {});
  test.skip('loads and displays meals for the current date', async () => {});
  test.skip('shows empty state when no meals are returned for the day', async () => {});
  test.skip('shows CalorieProgressBar when dailyTotals are present', async () => {});
  test.skip('hides CalorieProgressBar when dailyTotals are absent', async () => {});
  test.skip('clicking "Add product" inside a meal navigates to /add-product/:mealId', async () => {});
  test.skip('date is passed as ?date= query param when navigating between days', async () => {});
});
