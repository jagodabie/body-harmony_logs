import { expect, test } from '@playwright/test';

const emptyLogsResponse: never[] = [];

const weightLogsResponse = [
  {
    id: 'log-1',
    type: 'weight',
    value: '70',
    unit: 'kg',
    notes: 'Morning weight',
    date: '2026-03-27T08:00:00.000Z',
    createdAt: '2026-03-27T08:00:00.000Z',
    updatedAt: '2026-03-27T08:00:00.000Z',
  },
  {
    id: 'log-2',
    type: 'weight',
    value: '69.5',
    unit: 'kg',
    notes: '',
    date: '2026-03-26T08:00:00.000Z',
    createdAt: '2026-03-26T08:00:00.000Z',
    updatedAt: '2026-03-26T08:00:00.000Z',
  },
];

const newLogResponse = {
  id: 'log-3',
  type: 'weight',
  value: '71',
  unit: 'kg',
  notes: '',
  date: '2026-03-27T10:00:00.000Z',
  createdAt: '2026-03-27T10:00:00.000Z',
  updatedAt: '2026-03-27T10:00:00.000Z',
};

const updatedLogResponse = {
  ...weightLogsResponse[0],
  value: '71',
};

test.describe('Logs', () => {
  test.describe('tabs', () => {
    test('weight tab is active by default', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');

      await expect(page.locator('.log-tabs__pill--weight')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.log-list__header h3')).toHaveText('Weight logs');
    });

    test('switching to temperature tab updates the list title', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');
      await page.locator('.log-tabs__pill--temperature').click();

      await expect(page.locator('.log-list__header h3')).toHaveText('Temperature logs');
    });

    test('switching to mood tab updates the list title', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');
      await page.locator('.log-tabs__pill--mood').click();

      await expect(page.locator('.log-list__header h3')).toHaveText('Mood logs');
    });

    test('switching to activity tab updates the list title', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');
      await page.locator('.log-tabs__pill--activity').click();

      await expect(page.locator('.log-list__header h3')).toHaveText('Activity logs');
    });
  });

  test.describe('chart placeholder', () => {
    test('displays "Last 7 days" section with coming soon text', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');

      await expect(page.locator('.chart-placeholder__title')).toHaveText('Last 7 days');
      await expect(page.locator('.chart-placeholder__text')).toHaveText('Chart coming soon');
    });
  });

  test.describe('empty state', () => {
    test('shows "No entries" when the log list is empty', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');

      await expect(page.locator('.log-list__empty')).toHaveText('No entries');
    });
  });

  test.describe('create log', () => {
    test('clicking the + button opens the create modal', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');
      await page.locator('.log-list__header button').click();

      await expect(page.locator('.weight-log-modal')).toBeVisible();
      await expect(page.locator('.form-base__header h3')).toHaveText('Create weight log');
    });

    test('submitting the form with valid data creates a new log entry', async ({ page }) => {
      let logCreated = false;

      await page.route(/\/api\/body-metrics/, async route => {
        if (route.request().method() === 'POST') {
          logCreated = true;
          await route.fulfill({ json: newLogResponse });
        } else {
          await route.fulfill({ json: logCreated ? [newLogResponse] : emptyLogsResponse });
        }
      });

      await page.goto('/logs');
      await page.locator('.log-list__header button').click();

      await page.locator('input[name="date"]').fill('2026-03-27');
      await page.locator('input[name="value"]').fill('71');
      await page.locator('.header-button--right').click();

      await expect(page.locator('.log-item__value')).toContainText('71');
    });

    test('closing the modal without saving does not add an entry', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: emptyLogsResponse })
      );

      await page.goto('/logs');
      await page.locator('.log-list__header button').click();

      await expect(page.locator('.weight-log-modal')).toBeVisible();
      await page.locator('.header-button--left').click();

      await expect(page.locator('.weight-log-modal')).not.toBeAttached();
      await expect(page.locator('.log-list__empty')).toHaveText('No entries');
    });
  });

  test.describe('edit log', () => {
    test('clicking edit on a log item opens the edit modal with prefilled values', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, route =>
        route.fulfill({ json: weightLogsResponse })
      );

      await page.goto('/logs');

      await page.locator('.log-item').first().locator('[aria-label="Edit entry"]').click();

      await expect(page.locator('.weight-log-modal')).toBeVisible();
      await expect(page.locator('.form-base__header h3')).toHaveText('Edit weight log');
      await expect(page.locator('input[name="value"]')).toHaveValue('70');
    });

    test('submitting the edit form updates the log entry in the list', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, async route => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({ json: updatedLogResponse });
        } else {
          await route.fulfill({ json: weightLogsResponse });
        }
      });

      await page.goto('/logs');

      await page.locator('.log-item').first().locator('[aria-label="Edit entry"]').click();
      await page.locator('input[name="value"]').fill('71');
      await page.locator('.header-button--right').click();

      await expect(page.locator('.log-item').first().locator('.log-item__value')).toContainText('71');
    });
  });

  test.describe('delete log', () => {
    test('clicking delete on a log item removes it from the list', async ({ page }) => {
      await page.route(/\/api\/body-metrics/, async route => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({ status: 200 });
        } else {
          await route.fulfill({ json: weightLogsResponse });
        }
      });

      await page.goto('/logs');

      await expect(page.locator('.log-item')).toHaveCount(2);
      await page.locator('.log-item').first().locator('[aria-label="Delete entry"]').click();
      await expect(page.locator('.log-item')).toHaveCount(1);
    });
  });
});
