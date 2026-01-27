const { Builder, By, Key, until } = require("selenium-webdriver");

async function signupTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001/signup");

    await driver.findElement(By.name("name")).sendKeys("Test User");
    await driver.findElement(By.name("email")).sendKeys("test" + Date.now() + "@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("123456", Key.RETURN);

    await driver.wait(until.urlContains("login"), 5000);

    console.log("✅ Signup Test Passed");
  } catch (error) {
    console.log("❌ Signup Test Failed", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

signupTest();
