const { Builder, By, Key, until } = require("selenium-webdriver");

async function loginTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001/login");

    await driver.findElement(By.name("email")).sendKeys("test@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("123456", Key.RETURN);

    await driver.wait(until.urlContains("dashboard"), 5000);

    console.log("✅ Login Test Passed");
  } catch (error) {
    console.log("❌ Login Test Failed", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

loginTest();
