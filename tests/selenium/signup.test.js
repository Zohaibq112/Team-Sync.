const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

async function signupTest() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer("http://localhost:4444/wd/hub") // Selenium container
    .build();

  try {
    // Go to signup page
    await driver.get("http://host.docker.internal:5173/sign-up"); // update if your route is different

    // Wait for form fields
    const nameField = await driver.wait(until.elementLocated(By.name("name")), 10000);
    const emailField = await driver.wait(until.elementLocated(By.name("email")), 10000);
    const passwordField = await driver.wait(until.elementLocated(By.name("password")), 10000);

    // Fill form using env variables if available
    await nameField.sendKeys(process.env.TEST_NAME || "Test User");
    await emailField.sendKeys(process.env.TEST_SIGNUP_EMAIL || "testuser@example.com");
    await passwordField.sendKeys(process.env.TEST_SIGNUP_PASSWORD || "Test@1234");

    // Wait for redirect or success message (update selector if needed)
    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return url.includes("/workspace") || (await driver.findElements(By.id("successMessage"))).length > 0;
      },
      10000,
      "Signup did not complete"
    );

    console.log("✅ Signup Test Passed");

  } catch (error) {
    console.error("❌ Signup Test Failed", error);

    try {
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync("signup-error.png", screenshot, "base64");
      console.log("📸 Screenshot saved as signup-error.png");
    } catch (screenshotError) {
      console.error("Failed to take screenshot:", screenshotError);
    }

    process.exit(1);

  } finally {
    await driver.quit();
  }
}

signupTest();
