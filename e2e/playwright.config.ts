import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests',
    timeout: 100_000,

    // Reporters: lista + HTML
    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    use: {
        baseURL: 'http://localhost:3000',
        headless: true,            // corre en background sin UI
        screenshot: 'only-on-failure',
        video: 'off',              // no grabamos vídeo
        trace: 'on',               // siempre graba trace.zip
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], headless: true },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], headless: true },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], headless: true },
        },
    ],
});
