import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000", // default
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 30000,
});
