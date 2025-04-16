import { Page, Locator } from '@playwright/test';
import { WAIT_TIMEOUT } from 'ui/utils/constants';
import debugLib from 'debug';
import { CustomElement } from 'ui/utils/types';

const log = debugLib('app:base-page');

/**
 * BasePage serves as a base class for all pages in the application, providing common actions and waits.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Returns the page instance.
   * @returns {Page} The Playwright Page instance.
   */
  public getPage(): Page {
    return this.page;
  }

  // ---------- Universal Waits ----------

  protected async waitForState(
    element: CustomElement,
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    timeout = WAIT_TIMEOUT,
  ): Promise<void> {
    const locator = this.page.locator(element.locator);
    log(`Waiting for ${element.name} to be '${state}'`);
    try {
      await locator.waitFor({ state, timeout });
    } catch (err) {
      log(`Error waiting for ${element.name} to be '${state}': ${err}`);
    }
  }

  protected async waitForVisible(element: CustomElement, timeout = WAIT_TIMEOUT): Promise<void> {
    try {
      return this.waitForState(element, 'visible');
    } catch (err) {
      log(`Element ${element.name} was not visible during ${timeout}: ${err}`);
    }
  }

  protected async waitForHidden(element: CustomElement, timeout = WAIT_TIMEOUT): Promise<void> {
    return this.waitForState(element, 'hidden', timeout);
  }

  async waitForNetworkIdle(): Promise<void> {
    log('Waiting for network to be idle...');
    try {
      await this.page.waitForLoadState('networkidle');
    } catch (err) {
      log(`Error waiting for network to idle: ${err}`);
    }
  }

  async isElementVisible(element: CustomElement, timeout = WAIT_TIMEOUT): Promise<boolean> {
    try {
      await this.waitForVisible(element);
      return true;
    } catch {
      return false;
    }
  }

  // ---------- Actions ----------

  protected async click(element: CustomElement): Promise<void> {
    const locator = this.page.locator(element.locator);
    log(`Clicking on ${element.name}`);
    try {
      await locator.click();
    } catch (err) {
      log(`Error clicking on ${element.name}: ${err}`);
    }
  }

  protected async type(element: CustomElement, text: string): Promise<void> {
    const locator = this.page.locator(element.locator);
    log(`Typing into ${element.name}: "${text}"`);
    try {
      await locator.fill(text);
    } catch (err) {
      log(`Error typing into ${element.name}: ${err}`);
    }
  }

  protected async getText(element: CustomElement): Promise<string> {
    const locator = this.page.locator(element.locator);
    try {
      const text = await locator.textContent();
      log(`Text from ${element.name}: "${text?.trim()}"`);
      return text?.trim() || '';
    } catch (err) {
      log(`Error getting text from ${element.name}: ${err}`);
      return '';
    }
  }
}
