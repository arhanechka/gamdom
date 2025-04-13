import { test, expect } from '../fixtures';
import { CrashPage } from '../../src/pages/games/crash.page';
import { getGameConfig } from '../../src/config/environments';
import { MainPage } from '../../src/pages/main.page';

test.describe('Crash Game Betting', () => {
  test('Place minimum bet and verify acceptance @game', async ({ page, myFixture }) => {
    const mainPage: MainPage = new MainPage(page);
    const crash = new CrashPage(page);
    const { minBet } = getGameConfig('crash');

    await test.step('Place minimum bet', async () => {
      await mainPage.navigateToCrashGame();
      await crash.placeBet(minBet);
      await crash.expectBetAccepted();
    });

    await test.step('Verify bet reflection', async () => {
      await expect(await crash.waitForRoundResultAndCheckBetStatus()).toBe(true);
    });
  });
});
