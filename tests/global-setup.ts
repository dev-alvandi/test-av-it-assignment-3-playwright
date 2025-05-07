import { chromium } from '@playwright/test';

const LOGIN_URL = 'https://ltu-i0015n-2024-web.azurewebsites.net/login';
const STORAGE_PATH = 'storageState.json';

export default async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', 'stina');
    await page.fill('input[name="password"]', 'fåGelskådning');
    await page.click('button[type="submit"]');

    // Wait for redirect or something confirming success
    await page.waitForURL('**/');

    await page.context().storageState({ path: STORAGE_PATH });
    await browser.close();
};
