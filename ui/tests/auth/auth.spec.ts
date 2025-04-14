import { test, expect } from '@playwright/test';
import { AuthPage } from '@pages/auth.page';
import { MainPage } from '@pages/main.page';

/**
 * Authentication Flow Tests
 * This test suite covers the login functionality and redirects after successful authentication.
 */
test.describe('Authentication Flow', () => {
  let authPage: AuthPage;
  let mainPage: MainPage;

  /**
   * Setup before each test
   * Initializes page objects and navigates to the homepage.
   */
  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    mainPage = new MainPage(page);
    await page.goto('/');
    await authPage.openLoginForm();
  });

  /**
   * Test case: Valid credentials should redirect to the dashboard.
   * This verifies that after successful login, the user is redirected to the main page.
   */
  test('Valid credentials redirect to dashboard @smoke', async () => {
    // Perform login with valid credentials
    await authPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);

    // Verify successful login by checking user balance visibility
    await mainPage.expectSuccessfulLogin();
  });
});
