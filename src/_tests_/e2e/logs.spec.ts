import { test } from '@playwright/test';

test.describe('Logs', () => {
  test.describe('tabs', () => {
    test.skip('weight tab is active by default', async () => {});
    test.skip('switching to temperature tab updates the list title', async () => {});
    test.skip('switching to mood tab updates the list title', async () => {});
    test.skip('switching to activity tab updates the list title', async () => {});
  });

  test.describe('empty state', () => {
    test.skip('shows "Brak wpisów" when the log list is empty', async () => {});
  });

  test.describe('create log', () => {
    test.skip('clicking the + button opens the create modal', async () => {});
    test.skip('submitting the form with valid data creates a new log entry', async () => {});
    test.skip('closing the modal without saving does not add an entry', async () => {});
  });

  test.describe('edit log', () => {
    test.skip('clicking edit on a log item opens the edit modal with prefilled values', async () => {});
    test.skip('submitting the edit form updates the log entry in the list', async () => {});
  });

  test.describe('delete log', () => {
    test.skip('clicking delete on a log item removes it from the list', async () => {});
  });
});
