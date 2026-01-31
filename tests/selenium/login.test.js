const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

async function loginTest() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer("http://localhost:4444/wd/hub") // Selenium container
    .build();

  try {
    // Go to login page
    await driver.get("http://host.docker.internal:5173/");

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

    // Wait for workspace page (dynamic URL)
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
