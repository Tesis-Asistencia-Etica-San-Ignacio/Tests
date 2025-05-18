import { test, expect } from '@playwright/test';

test('Registry', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.getByRole('tab', { name: 'Registro' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu nombre' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu nombre' }).fill('Laura');
    await page.getByRole('textbox', { name: 'Ingresa tu apellido' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu apellido' }).fill('Ovalle');
    await page.getByRole('textbox', { name: 'Ingresa tu correo' }).click();
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await page.getByRole('textbox', { name: 'Ingresa tu correo' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).fill('Password1*');
    await page.getByRole('button', { name: 'Registrarse' }).click();
});