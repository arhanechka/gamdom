import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';

const log = debugLib('app:wallet-popup');

export class WalletPopup extends BasePage {
  protected readonly SELECTORS = {
    MODAL_CONTAINER: '[data-testid="modalContainer"]',
    WALLET_BUTTON: '[data-testid="vaultButton"]',
    HEADER_TITLE: '[data-testid="headerTitle"]',
    VAULT_BUTTON: '[data-testid="vaultButton"]',
    INPUT: 'input[data-testid="Input"]',
    DEPOSIT_BUTTON: '[data-testid="depositToVaultButton"]',
    WITHDRAW_BUTTON: '[data-testid="withdrawButton"]',
    PAYMENT_METHOD_CONTAINER: '[data-testid="vaultPaymentMethodContainer"]',
  };

  constructor(page: Page) {
    super(page);
  }

  // ---------- Actions ----------

  /**
   * Waits for the wallet popup to be visible.
   * @param timeout Timeout in milliseconds (default: 5000)
   */
  async waitModalForVisible(timeout = 5000): Promise<void> {
    log('Waiting for wallet modal to be visible...');
    await super.waitForVisible(this.getPage().locator(this.SELECTORS.MODAL_CONTAINER), timeout);
    log('Wallet modal is visible.');
  }

  /**
   * Checks if the popup is currently visible.
   */
  async isVisible(): Promise<boolean> {
    log('Checking if the wallet modal is visible...');
    return this.getPage().locator(this.SELECTORS.MODAL_CONTAINER).isVisible();
  }

  /**
   * Clicks on the wallet button.
   */
  async clickWalletButton(): Promise<void> {
    log('Clicking on wallet button...');
    const walletButton = this.getPage().locator(this.SELECTORS.WALLET_BUTTON);
    await this.ensureElementVisible(walletButton, 3000);
    await walletButton.click();
    log('Wallet button clicked.');
  }

  /**
   * Clicks on the vault button.
   */
  async clickVaultButton(): Promise<void> {
    log('Clicking on vault button...');
    const vaultButton = this.getPage().locator(this.SELECTORS.VAULT_BUTTON);
    await this.ensureElementVisible(vaultButton, 5000);
    await vaultButton.click();
    log('Vault button clicked.');
  }

  /**
   * Verifies that the header title is "Vault".
   */
  async expectHeaderTitleIsVault(): Promise<void> {
    log('Checking if header title is "Vault"...');
    const headerTitle = this.getPage().locator(this.SELECTORS.HEADER_TITLE);
    await this.ensureElementVisible(headerTitle, 5000);
    await expect(headerTitle).toHaveText('Vault');
    log('Header title is "Vault" and visible.');
  }

  /**
   * Deposits $10 into the vault.
   */
  async depositTenDollarsToVault(): Promise<void> {
    log('Depositing $10 into Vault...');
    const input = this.getPage().locator(this.SELECTORS.INPUT);
    const depositButton = this.getPage().locator(this.SELECTORS.DEPOSIT_BUTTON);

    await this.ensureElementVisible(input.first(), 10000);
    await input.first().fill('10');
    await this.ensureElementVisible(depositButton, 5000);
    await depositButton.click();
    log('$10 deposited to Vault.');
  }

  /**
   * Clicks on the withdraw button.
   */
  async clickWithdrawButton(): Promise<void> {
    log('Clicking on Withdraw button...');
    const withdrawButton = this.getPage().locator(this.SELECTORS.WITHDRAW_BUTTON);
    await this.ensureElementVisible(withdrawButton, 5000);
    await withdrawButton.click();
    log('Withdraw button clicked.');
  }

  /**
   * Verifies that the vault payment methods container is visible.
   */
  async expectVaultPaymentMethodsVisible(): Promise<void> {
    log('Verifying payment methods container is visible...');
    const paymentMethodContainer = this.getPage().locator(this.SELECTORS.PAYMENT_METHOD_CONTAINER);
    await this.ensureElementVisible(paymentMethodContainer, 5000);
    log('Vault payment method container is visible.');
  }

  // ---------- Helper Methods ----------

  /**
   * Ensures the element is visible within the given timeout.
   * @param element Locator of the element.
   * @param timeout Timeout for visibility check.
   */
  private async ensureElementVisible(element: Locator, timeout: number): Promise<void> {
    log(`Waiting for element to be visible within ${timeout}ms...`);
    await expect(element).toBeVisible({ timeout });
    log('Element is visible.');
  }
}
