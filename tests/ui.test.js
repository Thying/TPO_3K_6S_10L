const puppeteer = require('puppeteer');
const assert = require('assert');

describe('Тесты формы', function() {
    this.timeout(30000);
    let browser;
    let page;

    beforeEach(async function() {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // Открываем нашу форму
        const filePath = 'file://' + process.cwd().replace(/\\/g, '/') + '/index.html';
        await page.goto(filePath);
    });

    afterEach(async function() {
        if (browser) {
            await browser.close();
        }
    });

    // ТЕСТ 1: страница загружается и содержит заголовок
    it('должна загрузиться страница с заголовком "Регистрация"', async function() {
        const title = await page.$eval('h1', el => el.textContent);
        assert.strictEqual(title, 'Регистрация');
    });

    // ТЕСТ 2: поле для ввода имени существует
    it('должно быть поле для ввода имени', async function() {
        const nameField = await page.$('#name');
        assert.ok(nameField, 'Поле имени не найдено');
    });

    // ТЕСТ 3: поле для ввода email существует
    it('должно быть поле для ввода email', async function() {
        const emailField = await page.$('#email');
        assert.ok(emailField, 'Поле email не найдено');
    });

    // ТЕСТ 4: при нажатии на кнопку появляется сообщение
    it('при нажатии на кнопку появляется сообщение "Форма отправлена!"', async function() {
        // Нажимаем на кнопку
        await page.click('#submit-btn');
        
        // Ждём появления сообщения
        await page.waitForSelector('#message');
        
        // Проверяем текст сообщения
        const messageText = await page.$eval('#message', el => el.textContent);
        assert.strictEqual(messageText, 'Форма отправлена!');
    });
});