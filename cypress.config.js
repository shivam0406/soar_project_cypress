// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    defaultCommandTimeout: 10000, // Set the default timeout to 10 seconds
  },
});
