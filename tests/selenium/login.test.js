const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

async function loginTest() {
  // Use localhost with published ports when running from host
  const seleniumHost = process.env.SELENIUM_HOST || 'localhost';
  const seleniumPort = process.env.SELENIUM_PORT || '4444';
  const frontendHost = process.env.FRONTEND_HOST || 'localhost';
  const frontendPort = process.env.FRONTEND_PORT || '3001'; // From docker-compose ps output
  
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

    const emailField = await driver.wait(
      until.elementLocated(By.name("email")),
      10000
    );
    const passwordField = await driver.wait(
      until.elementLocated(By.name("password")),
      10000
    );

    await emailField.sendKeys(process.env.TEST_EMAIL || "zohaibqazi9@gmail.com");
    await passwordField.sendKeys(process.env.TEST_PASSWORD || "zohaib123", Key.RETURN);

    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return url.includes("/workspace");
      },
      10000,
      "Workspace page did not load"
    );

    console.log("✅ Login Test Passed");

  } catch (error) {
    console.error("❌ Login Test Failed", error);

    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("login-error.png", screenshot, "base64");
      console.log("📸 Screenshot saved as login-error.png");
    } catch (screenshotError) {
      console.error("Failed to take screenshot:", screenshotError);
    }

    process.exit(1);

  } finally {
    await driver.quit();
  }
}

loginTest();