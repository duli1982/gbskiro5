// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './e2e',
  use: {
    headless: true,
  },
};

module.exports = config;
