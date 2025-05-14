import { chromium, FullConfig } from '@playwright/test';
import { login } from '../shared/helpers/auth';
import { mkdirSync, writeFileSync } from 'fs';

async function globalSetup(_: FullConfig) {
    const { cookies } = await login();
    const storageState = {
        cookies: cookies.split('; ').map(raw => {
            const [name, value] = raw.split('=');
            return {
                name,
                value,
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                expires: -1
            };
        }),
        origins: []
    };


    mkdirSync('.auth', { recursive: true });
    writeFileSync('.auth/adminState.json', JSON.stringify(storageState, null, 2));
}
export default globalSetup;
