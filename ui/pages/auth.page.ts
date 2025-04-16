import { Page, expect } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';
import { Selectors } from 'ui/utils/types';

const log = debugLib('app:auth-page');

/**
 * AuthPage handles all interactions with the authentication UI.
 */
export class AuthPage extends BasePage {
  private readonly SELECTORS: Selectors = {
    AUTH_POPUP: { locator: '[data-testid="AuthPopup"]', name: 'Auth Popup' },
    USERNAME: { locator: '[name="username"]', name: 'Username Input' },
    PASSWORD: { locator: '[name="password"]', name: 'Password Input' },
    LOGIN_BUTTON: { locator: '[data-testid="start-playing-login"]', name: 'Login Button' },
    LOGOUT_BUTTON: { locator: '[data-testid="logout-button"]', name: 'Logout Button' },
    SIGNIN_NAV: { locator: '[data-testid="signin-nav"]', name: 'Sign In Navigation' },
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
    return await this.isElementVisible(this.SELECTORS.SIGNIN_NAV);
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
    await this.waitForVisible(this.SELECTORS.AUTH_POPUP);
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
}
