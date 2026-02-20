const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

async function loginTest() {
  // Use host.docker.internal to access host from container
  const seleniumHost = process.env.SELENIUM_HOST || 'host.docker.internal';
  const seleniumPort = process.env.SELENIUM_PORT || '4444';
  const frontendHost = process.env.FRONTEND_HOST || 'host.docker.internal';
  const frontendPort = process.env.FRONTEND_PORT || '3001';
  
  const seleniumUrl = `http://${seleniumHost}:${seleniumPort}/wd/hub`;
  const frontendUrl = `http://${frontendHost}:${frontendPort}/`;
  
  console.log(`Connecting to Selenium at: ${seleniumUrl}`);
  console.log(`Testing frontend at: ${frontendUrl}`);
  
  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer(seleniumUrl)
    .build();

  try {
    await driver.get(frontendUrl);
    // ... rest of your test
  } catch (error) {
    console.error("❌ Login Test Failed", error);
    // ... error handling
  }
}

loginTest();