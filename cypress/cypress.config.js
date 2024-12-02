const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    defaultCommandTimeout: 10000, // Set the default timeout to 10 seconds
    viewportWidth: 1920, // Set the default viewport width to 1920px
    viewportHeight: 1080, // Set the default viewport height to 1080px
    baseUrl: 'https://juice-shop.herokuapp.com/', // Set your base URL (replace with your app's URL)
    retries: {
      runMode: 2, // Retry failed tests twice in run mode
      openMode: 0, // No retries in open mode
    },
    screenshotOnRunFailure: true, // Take a screenshot on test failure
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});