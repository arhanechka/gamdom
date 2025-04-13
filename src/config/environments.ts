/**
 * Game configuration for all environments
 */
export const ENVIRONMENTS = {
  QA: {
    baseURL: 'https://qa-test-playground.teamgamdom.com',
    games: {
      crash: {
        minBet: 5,
        maxBet: 1000,
        maxMultiplier: 100,
      },
    },
  },
  /**
   * For example
   */
  PROD: {
    baseURL: 'https://teamgamdom.com',
    games: {
      crash: {
        minBet: 1,
        maxBet: 5000,
        maxMultiplier: 1000,
      },
    },
  },
} as const;

/**
 * Get game configuration for current environment
 */
export function getGameConfig(game: keyof typeof ENVIRONMENTS.QA.games) {
  return ENVIRONMENTS.QA.games[game];
}

/**
 * Current environment settings
 */
export const CURRENT_ENV = ENVIRONMENTS.QA;
