import { Locator } from '@playwright/test';

export type CustomElement = {
  name: string;
  locator: string;
};

export type Selectors = {
  [key: string]: CustomElement;
};
