import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 100000,
    setupNodeEvents(on, config) {
      // nothing needed here for now
    },
  },
});
