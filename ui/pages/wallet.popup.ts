import { expect, Page } from '@playwright/test';
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
  async waitModalForVisible(timeout = 5000): Promise<void> {
    log('Waiting for wallet modal to be visible...');
    await super.waitForVisible(this.SELECTORS.MODAL_CONTAINER, timeout);
    log('Wallet modal is visible.');
  }

  /**
   * Checks if the popup is currently visible.
   */
  async isVisible(): Promise<boolean> {
    log('Checking if the wallet modal is visible...');
    return this.getPage().locator(this.SELECTORS.MODAL_CONTAINER.locator).isVisible();
  }

  /**
   * Clicks on the wallet button.
   */
  async clickWalletButton(): Promise<void> {
    log('Clicking on wallet button...');
    await this.waitForVisible(this.SELECTORS.WALLET_BUTTON);
    await this.getPage().locator(this.SELECTORS.WALLET_BUTTON.locator).click();
    log('Wallet button clicked.');
  }

  /**
   * Clicks on the vault button.
   */
  async clickVaultButton(): Promise<void> {
    log('Clicking on vault button...');
    await this.waitForVisible(this.SELECTORS.VAULT_BUTTON);
    await this.getPage().locator(this.SELECTORS.VAULT_BUTTON.locator).click();
    log('Vault button clicked.');
  }

  /**
   * Verifies that the header title is "Vault".
   */
  async expectHeaderTitleIsVault(): Promise<void> {
    log('Checking if header title is "Vault"...');
    await this.waitForVisible(this.SELECTORS.HEADER_TITLE);
    const headerTitle = this.getPage().locator(this.SELECTORS.HEADER_TITLE.locator);
    await expect(headerTitle).toHaveText('Vault');
    log('Header title is "Vault" and visible.');
  }

  /**
   * Deposits $10 into the vault.
   */
  async depositTenDollarsToVault(): Promise<void> {
    log('Depositing $10 into Vault...');
    const input = this.getPage().locator(this.SELECTORS.INPUT.locator);
    await this.waitForVisible(this.SELECTORS.DEPOSIT_BUTTON);
    await input.first().fill('10');
    await this.waitForVisible(this.SELECTORS.DEPOSIT_BUTTON);
    await this.getPage().locator(this.SELECTORS.DEPOSIT_BUTTON.locator).click();
    log('$10 deposited to Vault.');
  }

  /**
   * Clicks on the withdraw button.
   */
  async clickWithdrawButton(): Promise<void> {
    log('Clicking on Withdraw button...');
    await this.waitForVisible(this.SELECTORS.WITHDRAW_BUTTON);
    await this.getPage().locator(this.SELECTORS.WITHDRAW_BUTTON.locator).click();
    log('Withdraw button clicked.');
  }

  /**
   * Verifies that the vault payment methods container is visible.
   */
  async expectVaultPaymentMethodsVisible(): Promise<void> {
    log('Verifying payment methods container is visible...');
    await this.waitForVisible(this.SELECTORS.PAYMENT_METHOD_CONTAINER);
    log('Vault payment method container is visible.');
  }
}
