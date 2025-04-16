import { Page } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';
import { Selectors } from 'ui/utils/types';

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
      locator: ':nth-match(a[href="/crash"]:has-text("Crash"), 1)',
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
  async expectSuccessfulLogin(): Promise<boolean> {
    log('Waiting for login page to be visible...');
    return (
      (await this.isElementVisible(this.SELECTORS.LOADING_CONTAINER)) &&
      (await this.isElementVisible(this.SELECTORS.USER_BALANCE))
    );
  }

  /**
   * Navigates to the Crash game page.
   */
  async navigateToCrashGame(): Promise<void> {
    const { locator, name } = this.SELECTORS.CRASH_LINK;
    const crashLink = this.getPage().locator(locator).first();
    log(`Waiting for ${name} to be visible...`);
    await this.waitForVisible(this.SELECTORS.CRASH_LINK);
    log(`Scrolling to ${name}...`);
    await crashLink.scrollIntoViewIfNeeded();
    await this.click(this.SELECTORS.CRASH_LINK);
  }

  /**
   * Clicks the wallet button, ensuring it is visible and interactable.
   */
  async clickWalletButton(timeout = 5000): Promise<void> {
    await this.waitForVisible(this.SELECTORS.WALLET_BUTTON, timeout);
    await this.click(this.SELECTORS.WALLET_BUTTON);
  }
}
