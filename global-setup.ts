/* eslint no-console: off */
import { chromium, FullConfig } from '@playwright/test';
import { AuthPage } from './src/pages/auth.page';
import { MainPage } from './src/pages/main.page';
import path from 'path';
import debug from 'debug';

const debagInfo = debug('setup:info');
const debugError = debug('setup:error');

/**
 * Global setup function that runs once before all tests.
 *
 * This setup ensures that we log in once before running the tests to avoid
 * multiple logins during each test case. The login state is saved to a
 * storage state file to be reused by subsequent tests, making the tests faster.
 *
 * **Important Notes:**
 * 1. This function is only executed once before all tests unless a test is
 *    explicitly marked with `@auth`. In that case, a standard login procedure
 *    will be performed for that test.
 * 2. If the login fails, the global setup will attempt to log in again,
 *    and if it still fails, it will take a screenshot and throw an error,
 *    stopping the execution.
 * 3. If login is successful, the setup will not run again, and tests can use
 *    the already authenticated session.
 * 4. The login credentials are taken from environment variables `TEST_USERNAME`
 *    and `TEST_PASSWORD`, with fallback to 'default_user' and 'default_pass'.
 */
async function globalSetup(config: FullConfig) {
  const isAuthTest = config.projects.some((project) => project.name === 'auth');

  if (isAuthTest) {
    debagInfo('Skipping global setup for auth tests');
    return;
  }

  const browser = await chromium.launch({
    headless: process.env.CI ? true : false,
    timeout: 60000,
  });

  const context = await browser.newContext({
    baseURL: config.projects[0].use.baseURL,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  const auth = new AuthPage(page);
  const main = new MainPage(page);

  try {
    await auth.navigateToLogin();
    debagInfo('Navigated to login page');

    if (await auth.isLoginPageVisible()) {
      debagInfo('Login page is visible, proceeding to login');

      await auth.openLoginForm();
      const username = process.env.TEST_USERNAME || 'default_user';
      const password = process.env.TEST_PASSWORD || 'default_pass';

      debagInfo(`Logging in with username: ${username}`);
      await auth.login(username, password);
      await main.expectSuccessfulLogin();
    } else {
      debagInfo('User is already logged in, skipping login process');
    }

    await context.storageState({
      path: path.join(__dirname, 'playwright/.auth/user.json'),
    });
    debagInfo('Storage state saved successfully');
  } catch (err) {
    debugError('Error during global setup: %O', err);
    await page.screenshot({ path: 'global-setup-error.png' });

    if (await auth.isLoginPageVisible()) {
      debagInfo('Retrying login after error...');
      const username = process.env.TEST_USERNAME || 'default_user';
      const password = process.env.TEST_PASSWORD || 'default_pass';
      await auth.login(username, password);
      await main.expectSuccessfulLogin();

      await context.storageState({
        path: path.join(__dirname, 'playwright/.auth/user.json'),
      });
      debagInfo('Login retry successful, storage state updated');
    } else {
      throw err;
    }
  } finally {
    await browser.close();
    debagInfo('Browser closed after setup');
  }
}

export default globalSetup;
