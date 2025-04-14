import { test, expect } from '../fixtures';
import { MainPage } from '@pages/main.page';
import { WalletPopup } from '@pages/wallet.popup';

test('Wallet popup appears after clicking wallet button', async ({ page, myFixture }) => {
  const mainPage = new MainPage(page);
  const walletPopup = new WalletPopup(page);

  await mainPage.clickWalletButton();
  await walletPopup.waitModalForVisible();

  const isVisible = await walletPopup.isVisible();
  expect(isVisible).toBe(true);
  await walletPopup.clickVaultButton();

  // Ensure modal container is visible
  const modalContainer = page.locator('[data-testid="modalContainer"]');
  await expect(modalContainer).toBeVisible({ timeout: 5000 });

  // Ensure header title is 'Vault'
  await walletPopup.expectHeaderTitleIsVault();
  // Клик по Vault Button
  await walletPopup.clickVaultButton();

  // Проверка, что заголовок в попапе "Vault"
  await walletPopup.expectHeaderTitleIsVault();

  // Депозит $10 в Vault
  await walletPopup.depositTenDollarsToVault();

  // Клик по кнопке Withdraw и проверка появления paymentMethodContainer
  await walletPopup.clickWithdrawButton();
  await walletPopup.expectVaultPaymentMethodsVisible();
});
