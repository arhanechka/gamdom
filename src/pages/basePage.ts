import { Page, Locator } from '@playwright/test';
import { WAIT_TIMEOUT } from '@utils/constants';
import debugLib from 'debug';

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

  /**
   * Waits for a specific state of an element (visible, hidden, attached, or detached).
   * @param locator The locator or selector to target.
   * @param state The state to wait for ('visible', 'hidden', 'attached', or 'detached').
   * @param timeout The timeout duration in milliseconds (default is WAIT_TIMEOUT).
   * @returns {Promise<void>}
   */
  protected async waitForState(
    locator: Locator | string,
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    timeout = WAIT_TIMEOUT,
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    log(`Waiting for [${typeof locator === 'string' ? locator : 'Locator'}] to be '${state}'`);
    await element.waitFor({ state, timeout });
  }

  /**
   * Waits for an element to be visible.
   * @param locator The locator or selector to target.
   * @param timeout The timeout duration in milliseconds (default is WAIT_TIMEOUT).
   * @returns {Promise<void>}
   */
  protected async waitForVisible(locator: Locator | string, timeout = WAIT_TIMEOUT): Promise<void> {
    return this.waitForState(locator, 'visible', timeout);
  }

  /**
   * Waits for an element to be hidden.
   * @param locator The locator or selector to target.
   * @param timeout The timeout duration in milliseconds (default is WAIT_TIMEOUT).
   * @returns {Promise<void>}
   */
  protected async waitForHidden(locator: Locator | string, timeout = WAIT_TIMEOUT): Promise<void> {
    return this.waitForState(locator, 'hidden', timeout);
  }

  /**
   * Waits for the network to become idle.
   * @returns {Promise<void>}
   */
  async waitForNetworkIdle(): Promise<void> {
    log('Waiting for network to be idle...');
    await this.page.waitForLoadState('networkidle');
  }

  // ---------- Actions ----------

  /**
   * Clicks on an element.
   * @param locator The locator or selector to target.
   * @returns {Promise<void>}
   */
  protected async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    log(`Clicking on [${typeof locator === 'string' ? locator : 'Locator'}]`);
    await element.click();
  }

  /**
   * Types text into an input field.
   * @param locator The locator or selector to target.
   * @param text The text to type.
   * @returns {Promise<void>}
   */
  protected async type(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    log(`Typing into [${typeof locator === 'string' ? locator : 'Locator'}]: "${text}"`);
    await element.fill(text);
  }

  /**
   * Gets the text content of an element.
   * @param locator The locator or selector to target.
   * @returns {Promise<string>} The text content of the element.
   */
  protected async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.textContent();
    log(`Text from [${typeof locator === 'string' ? locator : 'Locator'}]: "${text?.trim()}"`);
    return text?.trim() || '';
  }
}
