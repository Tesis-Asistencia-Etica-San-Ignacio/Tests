import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './specs',
    globalSetup: require.resolve('./global-setup.ts'),
    use: {
        baseURL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
        storageState: '.auth/adminState.json'
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    ]
});
