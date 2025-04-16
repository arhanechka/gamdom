import { test, expect } from '../fixtures';

/**
 * Authentication Flow Tests
 * This test suite covers the login functionality and redirects after successful authentication.
 */
test.describe('Authentication Flow', () => {
  test('Valid credentials redirect to dashboard @auth', async ({ authPage, mainPage }) => {
    await test.step('Open login form', async () => {
      await authPage.openLoginForm();
    });

    await test.step('Perform login with valid credentials', async () => {
      await authPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
    });

    await test.step('Verify successful login by checking balance', async () => {
      expect(await mainPage.expectSuccessfulLogin()).toBeTruthy;
    });
  });
});
