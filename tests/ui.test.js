const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

describe('Тесты формы', function() {
    this.timeout(60000);
    let driver;

    beforeEach(async function() {
        // Подключаемся к запущенному chromedriver
        driver = await new Builder()
            .usingServer('http://localhost:9515')  // chromedriver по умолчанию
            .forBrowser('chrome')
            .build();
        
        const filePath = 'file://' + process.cwd() + '/index.html';
        await driver.get(filePath);
    });

    afterEach(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('должна загрузиться страница с заголовком "Регистрация"', async function() {
        const title = await driver.findElement(By.css('h1')).getText();
        assert.strictEqual(title, 'Регистрация');
    });

    it('должно быть поле для ввода имени', async function() {
        const nameField = await driver.findElement(By.id('name'));
        const isDisplayed = await nameField.isDisplayed();
        assert.strictEqual(isDisplayed, true);
    });

    it('должно быть поле для ввода email', async function() {
        const emailField = await driver.findElement(By.id('email'));
        const isDisplayed = await emailField.isDisplayed();
        assert.strictEqual(isDisplayed, true);
    });

    it('при нажатии на кнопку появляется сообщение', async function() {
        const button = await driver.findElement(By.id('submit-btn'));
        await button.click();
        
        const message = await driver.findElement(By.id('message'));
        const messageText = await message.getText();
        
        assert.strictEqual(messageText, 'Форма отправлена!');
    });
});