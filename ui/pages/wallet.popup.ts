import { Page } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import debugLib from 'debug';
import { Selectors } from 'ui/utils/types';

const log = debugLib('app:wallet-popup');

export class WalletPopup extends BasePage {
  protected readonly SELECTORS: Selectors = {
    MODAL_CONTAINER: { name: 'Modal container', locator: '[data-testid="modalContainer"]' },
    WALLET_BUTTON: { name: 'Wallet button', locator: '[data-testid="vaultButton"]' },
    HEADER_TITLE: { name: 'Header title', locator: '[data-testid="headerTitle"]' },
    VAULT_BUTTON: { name: 'Vault button', locator: '[data-testid="vaultButton"]' },
    INPUT: { name: 'Amount input', locator: 'input[data-testid="Input"]' },
    DEPOSIT_BUTTON: { name: 'Deposit button', locator: '[data-testid="depositToVaultButton"]' },
    WITHDRAW_BUTTON: { name: 'Withdraw button', locator: '[data-testid="withdrawButton"]' },
    PAYMENT_METHOD_CONTAINER: {
      name: 'Payment method container',
      locator: '[data-testid="vaultPaymentMethodContainer"]',
    },
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Waits for the wallet popup to be visible.
   * @param timeout Timeout in milliseconds (default: 5000)
   */
  async isWalletModalVisible(timeout = 5000): Promise<boolean> {
    log('Waiting for wallet modal to be visible...');
    return await this.isElementVisible(this.SELECTORS.MODAL_CONTAINER, timeout);
  }

  /**
   * Clicks on the wallet button.
   */
  async clickWalletButton(): Promise<void> {
    log('Clicking on wallet button...');
    await this.waitForVisible(this.SELECTORS.WALLET_BUTTON);
    await this.click(this.SELECTORS.WALLET_BUTTON);
    log('Wallet button clicked.');
  }

  /**
   * Clicks on the vault button.
   */
  async clickVaultButton(): Promise<void> {
    log('Clicking on vault button...');
    await this.waitForVisible(this.SELECTORS.VAULT_BUTTON);
    await this.click(this.SELECTORS.VAULT_BUTTON);
    log('Vault button clicked.');
  }

  /**
   * Verifies that the header title is "Vault".
   */
  async getVaultHeaderTitle(): Promise<string> {
    log('Checking if header title is "Vault"...');
    await this.waitForVisible(this.SELECTORS.HEADER_TITLE);
    return await this.getText(this.SELECTORS.HEADER_TITLE);
  }

  /**
   * Deposits $10 into the vault.
   */
  async depositTenDollarsToVault(): Promise<void> {
    log('Depositing $10 into Vault...');
    const input = this.getPage().locator(this.SELECTORS.INPUT.locator);
    await this.waitForVisible(this.SELECTORS.DEPOSIT_BUTTON);
    await this.type(this.SELECTORS.INPUT, '10');
    await this.waitForVisible(this.SELECTORS.DEPOSIT_BUTTON);
    await this.click(this.SELECTORS.DEPOSIT_BUTTON);
    log('$10 deposited to Vault.');
  }

  /**
   * Clicks on the withdraw button.
   */
  async clickWithdrawButton(): Promise<void> {
    log('Clicking on Withdraw button...');
    await this.waitForVisible(this.SELECTORS.WITHDRAW_BUTTON);
    await this.click(this.SELECTORS.WITHDRAW_BUTTON);
    log('Withdraw button clicked.');
  }

  /**
   * Verifies that the vault payment methods container is visible.
   */
  async expectVaultPaymentMethodsVisible(): Promise<boolean> {
    log('Verifying payment methods container is visible...');
    return await this.isElementVisible(this.SELECTORS.PAYMENT_METHOD_CONTAINER);
  }
}
