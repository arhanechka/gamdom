import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';

const log = debugLib('app:main-page'); // Run with DEBUG=app:* or DEBUG=app:main-page

export class MainPage extends BasePage {
  protected readonly SELECTORS = {
    LOADING_CONTAINER: '[data-testid="page-container-animate"]',
    USER_BALANCE: '[data-testid="headerUserBalance"]',
    CRASH_LINK: 'a[href="/crash"]:has-text("Crash")',
    WALLET_BUTTON: '[data-testid="headerWalletButton"]',
  };

  constructor(page: Page) {
    super(page);
  }

  // ---------- Actions ----------

  /**
   * Waits for the page to load successfully and ensures the user balance is present.
   * @returns {Promise<void>}
   */
  async expectSuccessfulLogin(): Promise<void> {
    log('Waiting for loading container to be visible...');
    await this.waitForVisible(this.SELECTORS.LOADING_CONTAINER);

    log('Checking if user balance is displayed...');
    await expect(this.getPage().locator(this.SELECTORS.USER_BALANCE)).not.toBeEmpty();
    log('Login successful: User balance is present.');
  }

  /**
   * Navigates to the Crash game page.
   * Waits for the link to be visible and then clicks it.
   * @throws {Error} If the element is not interactable or found.
   * @returns {Promise<void>}
   */
  async navigateToCrashGame(): Promise<void> {
    const crashLink = this.getPage().locator(this.SELECTORS.CRASH_LINK).first();

    log('Waiting for Crash game link to be visible...');
    await this.waitForVisible(crashLink);

    log('Scrolling to Crash game link...');
    await crashLink.scrollIntoViewIfNeeded();

    log('Clicking Crash game link...');
    try {
      await crashLink.click({ force: true });
      log('Clicked on Crash game link successfully.');
    } catch (e) {
      log('Failed to click Crash game link:', e);
      throw new Error('Crash game link is not interactable or not found.');
    }
  }

  /**
   * Clicks the wallet button, ensuring it is visible and interactable.
   * @param timeout Timeout for the visibility check (default 5000ms).
   * @returns {Promise<void>}
   */
  async clickWalletButton(timeout = 5000): Promise<void> {
    const walletButton = this.getPage().locator(this.SELECTORS.WALLET_BUTTON);

    log('Checking if wallet button is visible...');
    try {
      await this.waitForVisible(walletButton, timeout);

      log('Wallet button is visible. Clicking...');
      await walletButton.click();

      log('Wallet button clicked successfully.');
    } catch (e) {
      log('Failed to click wallet button:', e);
      throw new Error('Wallet button is not clickable or not found on the page.');
    }
  }
}
