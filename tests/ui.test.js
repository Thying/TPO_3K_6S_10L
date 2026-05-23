const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

// Определяем, где запущен тест (локально или на GitHub)
const isGitHubActions = process.env.CI === 'true';

describe('Тесты формы', function() {
    this.timeout(60000); // Для GitHub Actions нужно больше времени
    let driver;

    beforeEach(async function() {
        let builder = new Builder();
        
        if (isGitHubActions) {
            // На GitHub Actions используем Chrome
            const chrome = require('selenium-webdriver/chrome');
            const options = new chrome.Options();
            options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
            builder = builder.forBrowser('chrome').setChromeOptions(options);
        } else {
            // Локально на Windows используем Edge
            require('edgedriver');
            builder = builder.forBrowser('MicrosoftEdge');
        }
        
        driver = await builder.build();
        
        const currentPath = process.cwd();
        const filePath = 'file:///' + currentPath.replace(/\\/g, '/') + '/index.html';
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

    it('при нажатии на кнопку появляется сообщение "Форма отправлена!"', async function() {
        const button = await driver.findElement(By.id('submit-btn'));
        await button.click();
        const message = await driver.findElement(By.id('message'));
        const messageText = await message.getText();
        assert.strictEqual(messageText, 'Форма отправлена!');
    });
});