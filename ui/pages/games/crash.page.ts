import { Page, Locator } from '@playwright/test';
import { getGameConfig } from 'ui/utils/config/environments';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';
import { Selectors } from 'ui/utils/types';

const log = debugLib('app:crash-page');

/**
 * CrashPage handles all interactions with the Crash game UI.
 */
export class CrashPage extends BasePage {
  protected readonly SELECTORS: Selectors = {
    BET_INPUT: { name: 'Bet input', locator: 'input[data-testid="Input"]' },
    PLACE_BET_BUTTON: { name: 'Place Bet button', locator: '[data-testid="crashPlaceBetButton"]' },
    CURRENT_BET_BOX: {
      name: 'Current Bet Box',
      locator: '[data-testid="crashCurrentBetBoxesContainer"]',
    },
    BET_STATUS: { name: 'Bet Status Table', locator: 'table[aria-label="live bets table"]' },
    MULTIPLIER_DISPLAY: { name: 'Multiplier Display', locator: '[data-testid="crash-multiplier"]' },
  };

  constructor(page: Page) {
    super(page);
  }

  // ---------- Locators ----------

  private get betInput(): Locator {
    return this.page.locator(this.SELECTORS.BET_INPUT.locator);
  }

  private get placeBetButton(): Locator {
    return this.page.locator(this.SELECTORS.PLACE_BET_BUTTON.locator);
  }

  private get currentBetBox(): Locator {
    return this.page.locator(this.SELECTORS.CURRENT_BET_BOX.locator);
  }

  private get betStatus(): Locator {
    return this.page.locator(this.SELECTORS.BET_STATUS.locator);
  }

  private get multiplierDisplay(): Locator {
    return this.page.locator(this.SELECTORS.MULTIPLIER_DISPLAY.locator);
  }

  // ---------- Actions ----------

  /**
   * Place a bet within allowed limits.
   * @param amount The bet amount.
   * @throws Error if the bet amount is outside the allowed range.
   */
  async placeBet(amount: number): Promise<void> {
    const { minBet, maxBet } = getGameConfig('crash');
    log(`Placing bet: ${amount} (allowed: ${minBet} - ${maxBet})`);

    if (amount < minBet || amount > maxBet) {
      throw new Error(`Bet amount ${amount} is outside allowed range (${minBet}-${maxBet})`);
    }
    await this.waitForVisible(this.SELECTORS.BET_INPUT);
    await this.click(this.SELECTORS.BET_INPUT);
    await this.type(this.SELECTORS.BET_INPUT, amount.toString());
    await this.click(this.SELECTORS.PLACE_BET_BUTTON);

    log('Bet placed successfully');
  }

  /**
   * Check that the bet was accepted (CURRENT_BET_BOX is visible).
   * @param timeout The maximum time to wait for the bet to be accepted.
   * @returns A promise that resolves to a boolean indicating if the bet was accepted.
   */
  async expectBetAccepted(timeout = 10000): Promise<boolean> {
    log('Checking if bet was accepted...');
    await this.currentBetBox.scrollIntoViewIfNeeded();
    const isVisible = await this.currentBetBox.isVisible({ timeout });
    log(`Bet accepted: ${isVisible}`);
    return isVisible;
  }

  /**
   * Wait for round to end, check bet status table visibility.
   * @param timeout The maximum time to wait for the round to end.
   * @returns A promise that resolves to a boolean indicating if the bet status table is visible.
   */
  async waitForRoundResultAndCheckBetStatus(timeout = 10000): Promise<boolean> {
    const start = Date.now();
    log('Waiting for round to end...');

    try {
      await this.waitForHidden(this.SELECTORS.CURRENT_BET_BOX, timeout);
      log('Current bet box disappeared');
    } catch {
      log('Timeout while waiting for current bet box to disappear');
    }

    const elapsed = Date.now() - start;
    const remaining = Math.max(timeout - elapsed, 1000);

    try {
      await this.betStatus.scrollIntoViewIfNeeded();
      await this.waitForVisible(this.SELECTORS.BET_STATUS, remaining);
      const rowCount = await this.getBetStatusRowCount();
      log(`Bet status visible, row count: ${rowCount}`);
      return true;
    } catch {
      log('Bet status not visible after round');
      return false;
    }
  }

  /**
   * Get the number of rows in bet status table.
   * @returns A promise that resolves to the number of rows in the bet status table.
   */
  async getBetStatusRowCount(): Promise<number> {
    const rows = this.betStatus.locator('tr');
    const count = await rows.count();
    log(`Bet status table row count: ${count}`);
    return count;
  }

  /**
   * Read the live multiplier (e.g., "1.23x").
   * @returns A promise that resolves to the current multiplier as a number.
   */
  async getCurrentMultiplier(): Promise<number> {
    const text = await this.getText(this.SELECTORS.MULTIPLIER_DISPLAY);
    const cleaned = text.replace('x', '').trim();
    const multiplier = parseFloat(cleaned) || 0;
    log(`Current multiplier: ${multiplier}`);
    return multiplier;
  }
}
