import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  await page.getByRole('textbox', { name: 'Ingresa tu correo' }).click();
  await page.getByRole('textbox', { name: 'Ingresa tu correo' }).fill('admin-husi@gmail.com');
  await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).click();
  await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).fill('Password123*');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
});