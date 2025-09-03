import { test, expect } from '@playwright/test';

test.describe('SauceDemo E2E Tests', () => {
    test('should complete full e2e checkout process flow', async ({ page }) => {

        // Add test metadata
        test.info().annotations.push({
            type: 'test-id',
            description: 'TC001'
        });

        test.info().annotations.push({
            type: 'severity',
            description: 'critical'
        });

        await page.goto(process.env.TEST_BASE_URL || 'https://www.saucedemo.com');

        // Login with valid credentials from environment variables
        await page.fill('#user-name', process.env.SAUCEDEMO_USERNAME);
        await page.fill('#password', process.env.SAUCEDEMO_PASSWORD);
        await page.click('#login-button');
        await page.waitForTimeout(1000);

        // Add first item to cart
        await page.locator("//button[@data-test='add-to-cart-sauce-labs-backpack']").click();
        await page.waitForTimeout(1000);

        // Go to cart
        await page.locator("//a[@class='shopping_cart_link']").click();

        //Verify item in cart
        await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
        await page.waitForTimeout(2000);

        // Checkout process
        await page.locator("//button[@data-test='checkout']").click();
        await page.getByPlaceholder("First Name").fill("John");
        await page.fill('#last-name', 'Doe', { delay: 100 });
        await page.fill('#postal-code', '12345', { delay: 100 });
        await page.click('input[data-test="continue"]');
        await page.click('button[data-test="finish"]');
        await page.waitForTimeout(1000);

        // Verify order completion and status
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        await expect(page.locator('.complete-text')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

        // Logout
        await page.click('#react-burger-menu-btn');
        await page.click('#logout_sidebar_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
});