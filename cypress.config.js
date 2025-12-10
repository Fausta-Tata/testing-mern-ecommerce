// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      // Untuk user biasa
      testEmail: 'test@gmail.com',
      testPassword: 'Test123456',
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});