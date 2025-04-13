import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';

const log = debugLib('app:auth-page');

/**
 * AuthPage handles all interactions with the authentication UI.
 */
export class AuthPage extends BasePage {
  private readonly SELECTORS: Record<string, string> = {
    AUTH_POPUP: '[data-testid="AuthPopup"]',
    USERNAME: '[name="username"]',
    PASSWORD: '[name="password"]',
    LOGIN_BUTTON: '[data-testid="start-playing-login"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
    SIGNIN_NAV: '[data-testid="signin-nav"]',
  };

  constructor(page: Page) {
    super(page);
  }

  // ---------- Actions ----------

  /**
   * Checks if the login page is visible.
   * @returns A promise that resolves to a boolean indicating if the login page is visible.
   */
  async isLoginPageVisible(): Promise<boolean> {
    try {
      await this.waitForVisible(this.SELECTORS.SIGNIN_NAV);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigates to the login page.
   */
  async navigateToLogin(): Promise<void> {
    log('Navigating to login page...');
    await this.getPage().goto('/');
  }

  /**
   * Opens the login form by clicking the sign-in button.
   */
  async openLoginForm(): Promise<void> {
    log('Opening login form...');
    await this.click(this.SELECTORS.SIGNIN_NAV);
    await this.expectLoginFormVisible();
  }

  /**
   * Verifies that the login form is visible.
   */
  private async expectLoginFormVisible(): Promise<void> {
    log('Expecting login form to be visible...');
    await expect(this.getPage().locator(this.SELECTORS.AUTH_POPUP)).toBeVisible();
  }

  /**
   * Logs in using provided credentials.
   * @param username The username to use.
   * @param password The password to use.
   */
  async login(username: string, password: string): Promise<void> {
    log(`Logging in with username: ${username}`);
    await this.type(this.SELECTORS.USERNAME, username);
    await this.type(this.SELECTORS.PASSWORD, password);
    await this.click(this.SELECTORS.LOGIN_BUTTON);
  }

  /**
   * Logs out the user.
   */
  async logout(): Promise<void> {
    log('Logging out...');
    await this.click(this.SELECTORS.LOGOUT_BUTTON);
    await expect(this.getPage()).toHaveURL(/login/);
  }
}
