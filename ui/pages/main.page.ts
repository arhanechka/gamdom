import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';
import { Selectors } from 'ui/utils/types';
import { WAIT_TIMEOUT } from 'ui/utils/constants';

const log = debugLib('app:main-page'); // Run with DEBUG=app:* or DEBUG=app:main-page

export class MainPage extends BasePage {
  protected readonly SELECTORS: Selectors = {
    LOADING_CONTAINER: {
      locator: '[data-testid="page-container-animate"]',
      name: 'Loading Container',
    },
    USER_BALANCE: {
      locator: '[data-testid="headerUserBalance"]',
      name: 'User Balance',
    },
    CRASH_LINK: {
      locator: 'a[href="/crash"]:has-text("Crash")',
      name: 'Crash Game Link',
    },
    WALLET_BUTTON: {
      locator: '[data-testid="headerWalletButton"]',
      name: 'Wallet Button',
    },
  };

  constructor(page: Page) {
    super(page);
  }

  // ---------- Actions ----------

  /**
   * Waits for the page to load successfully and ensures the user balance is present.
   */
  async expectSuccessfulLogin(): Promise<void> {
    log('Waiting for loading container to be visible...');
    await this.waitForVisible(this.SELECTORS.LOADING_CONTAINER);

    log('Checking if user balance is displayed...');
    await expect(this.getPage().locator(this.SELECTORS.USER_BALANCE.locator)).not.toBeEmpty();
    log('Login successful: User balance is present.');
  }

  /**
   * Navigates to the Crash game page.
   */
  async navigateToCrashGame(): Promise<void> {
    const { locator, name } = this.SELECTORS.CRASH_LINK;
    const crashLink = this.getPage().locator(locator).first();

    log(`Waiting for ${name} to be visible...`);
    await crashLink.waitFor({ state: 'visible', timeout: WAIT_TIMEOUT });
    log(`Scrolling to ${name}...`);
    await crashLink.scrollIntoViewIfNeeded();

    log(`Clicking ${name}...`);
    try {
      await crashLink.click({ force: true });
      log(`Clicked on ${name} successfully.`);
    } catch (e) {
      log(`Failed to click ${name}:`, e);
      throw new Error(`${name} is not interactable or not found.`);
    }
  }

  /**
   * Clicks the wallet button, ensuring it is visible and interactable.
   */
  async clickWalletButton(timeout = 5000): Promise<void> {
    const { locator, name } = this.SELECTORS.WALLET_BUTTON;
    const walletButton = this.getPage().locator(locator);

    log(`Checking if ${name} is visible...`);
    try {
      await this.waitForVisible(this.SELECTORS.WALLET_BUTTON, timeout);

      log(`${name} is visible. Clicking...`);
      await walletButton.click();

      log(`${name} clicked successfully.`);
    } catch (e) {
      log(`Failed to click ${name}:`, e);
      throw new Error(`${name} is not clickable or not found on the page.`);
    }
  }
}
