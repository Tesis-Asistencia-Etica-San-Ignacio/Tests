import { chromium } from '@playwright/test';
import { writeFile } from 'fs/promises';

const authFile = 'storageState.json';

export default async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${process.env.FRONTEND_URL}/login`);

    await page.fill('input[name=email]', process.env.ADMIN_EMAIL!);
    await page.fill('input[name=password]', process.env.ADMIN_PASSWORD!);
    await page.click('button[type=submit]');
    await page.context().storageState({ path: authFile });

    await browser.close();
};
