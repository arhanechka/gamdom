import { test, expect } from '../fixtures';
import { WalletPopup } from '@pages/wallet.popup';

/**
 * Wallet Popup Flow Tests
 * This suite tests the functionality of the wallet popup,
 * including opening it, interacting with its vault section, and handling deposits/withdrawals.
 */
test.describe('Wallet Popup Flow', () => {
  test('Wallet popup appears after clicking wallet button @wallet', async ({ page, mainPage }) => {
    const walletPopup = new WalletPopup(page);

    await test.step('Click on wallet button to open wallet popup', async () => {
      await mainPage.clickWalletButton();
      expect(await walletPopup.isWalletModalVisible()).toBeTruthy;
    });

    await test.step('Open Vault section in wallet popup', async () => {
      await walletPopup.clickVaultButton();
      expect(await walletPopup.getVaultHeaderTitle()).toBe('Vault');
    });

    await test.step('Deposit $10 into the Vault', async () => {
      await walletPopup.depositTenDollarsToVault();
    });

    await test.step('Click Withdraw button and verify payment methods are shown', async () => {
      await walletPopup.clickWithdrawButton();
      expect(await walletPopup.expectVaultPaymentMethodsVisible()).toBeTruthy;
    });
  });
});
