import { test, expect } from '../fixtures';
import { CrashPage } from '@pages/games/crash.page';
import { getGameConfig } from '@config/environments';

/**
 * Crash Game Betting Tests
 * This suite verifies that a user can place a minimum bet in the Crash game
 * and confirms the bet is accepted and reflected in the round result.
 */
test.describe('Crash Game Betting', () => {
  const { minBet } = getGameConfig('crash');

  test('Place minimum bet and verify acceptance @game', async ({ page, mainPage }) => {
    const crash = new CrashPage(page);

    await test.step('Navigate to Crash game', async () => {
      await mainPage.navigateToCrashGame();
    });

    await test.step(`Place minimum bet: ${minBet}`, async () => {
      await crash.placeBet(minBet);
      expect(await crash.expectBetAccepted()).toBeTruthy;
    });

    await test.step('Wait for round result and check if bet is reflected', async () => {
      expect(await crash.waitForRoundResultAndCheckBetStatus()).toBe(true);
    });
  });
});
