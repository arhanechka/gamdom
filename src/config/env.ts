import 'dotenv/config';

interface TestCredentials {
  username: string;
  password: string;
}

export function getTestCredentials(env: string = 'QA'): TestCredentials {
  const envPrefix = env === 'QA' ? 'QA_' : 'STAGING_';

  return {
    username: process.env[`${envPrefix}TEST_USERNAME`] || process.env.TEST_USERNAME || '',
    password: process.env[`${envPrefix}TEST_PASSWORD`] || process.env.TEST_PASSWORD || '',
  };
}

export const CREDENTIALS = getTestCredentials(process.env.ENV);
