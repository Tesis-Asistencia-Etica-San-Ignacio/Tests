import { test, expect } from '@playwright/test';
import path from 'path';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');
    await page.getByRole('textbox', { name: 'Ingresa tu correo' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu correo' }).fill('admin-husi@gmail.com');
    await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).click();
    await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).fill('Password123*');
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await page.getByRole('button', { name: 'Ajustes' }).click();
    await page.getByRole('link', { name: 'Inteligencia artificial' }).click();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'gemini' }).click();
    await page.getByRole('button', { name: 'Seleccionar proveedor' }).click();
    await page.getByRole('button', { name: 'Cambiar' }).click();
    await page.getByRole('combobox').filter({ hasText: 'model' }).click();
    await page.getByRole('option', { name: 'gemini-2.0-flash', exact: true }).click();
    await page.getByRole('button', { name: 'Cambiar Modelo de IA' }).click();
    await page.getByRole('button', { name: 'Sí, actualizar' }).click();
    await page.getByRole('button', { name: 'Reiniciar Prompts' }).click();
    await page.getByPlaceholder('REINICIAR').press('CapsLock');
    await page.getByPlaceholder('REINICIAR').fill('REINICIAR');
    await page.getByRole('button', { name: 'Reiniciar' }).click();
    await page.getByRole('listitem').filter({ hasText: /^Apariencia$/ }).getByRole('link').click();
    await page.locator('div:nth-child(2) > .gap-2 > div > div > div:nth-child(2)').click();
    await page.getByRole('button', { name: 'Actualizar preferencias' }).click();
    await page.getByRole('complementary').getByRole('link', { name: 'Cuenta' }).click();
    await page.getByRole('textbox', { name: 'Nombre' }).click();
    await page.getByRole('textbox', { name: 'Nombre' }).fill('Admin-');
    await page.getByRole('textbox', { name: 'Nombre' }).press('CapsLock');
    const uniqueName = `Admin-${Date.now()}`;
    await page.getByRole('textbox', { name: 'Nombre' }).fill(uniqueName);
    await page.getByRole('button', { name: 'Actualizar Cuenta' }).click();
    await page.getByRole('button', { name: 'Sí, actualizar' }).click();
    await page.getByRole('complementary').getByRole('link', { name: 'Apariencia' }).click();
    await page.locator('.flex > .h-2').first().click();
    await page.getByRole('button', { name: 'Actualizar preferencias' }).click();
    await page.getByRole('link', { name: 'Subir archivos' }).click();
    await page.getByText('Click para subir archivos o arrastra y sueltahasta 10 archivos PDF/Word').click();
    const pdfPath = path.resolve(__dirname, 'auth', 'fixtures', 'IFC 489 INICIAL.pdf');

    await page.locator('#dropzone-file').setInputFiles(pdfPath);
    await page.getByRole('row', { name: 'IFC 489 INICIAL.pdf 220.6 KB' }).getByRole('button').click();
    await page.getByText('Click para subir archivos o arrastra y sueltahasta 10 archivos PDF/Word').click();
    await page.locator('#dropzone-file').setInputFiles(pdfPath);
    await page.getByRole('button', { name: 'Subir Archivos' }).click();
    await page.getByRole('button', { name: 'Vistas' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('button', { name: 'Estado' }).first().click();
    await page.getByRole('option', { name: 'Pendiente' }).locator('div').click();
    await page.getByRole('option', { name: 'En curso' }).locator('div').click();
    await page.getByRole('option', { name: 'Evaluado' }).locator('div').click();
    await page.getByRole('button', { name: 'Borrar filtros' }).click();
    await page.getByRole('button', { name: 'Aprobado' }).first().click();
    await page.getByRole('option', { name: 'Aprobado', exact: true }).locator('div').click();
    await page.getByRole('option', { name: 'No aprobado' }).locator('div').click();
    await page.getByRole('option', { name: 'Aprobado', exact: true }).locator('div').click();
    await page.getByRole('button', { name: 'Borrar filtros' }).click();
    const miFila = page.getByRole('row', { name: /IFC 489 INICIAL\.pdf/ });
    await miFila.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'Editar' }).click();
    await page.getByRole('textbox', { name: 'Correo del estudiante' }).click();
    await page.getByRole('textbox', { name: 'Correo del estudiante' }).fill('jmanuelrardilla@gmail.com');
    await page.getByRole('textbox', { name: 'Tipo de error' }).click();
    await page.getByRole('textbox', { name: 'Tipo de error' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Tipo de error' }).fill('Muy malo');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await miFila.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'Evaluar' }).click({ force: true });
    await page.getByRole('cell', { name: 'Contiene versión y fecha del' }).click();
    await page.getByText('Contiene título del proyecto').click();
    await page.getByRole('cell', { name: 'Contiene título del proyecto' }).click();
    await page.getByText('Describe la justificación y').click();
    await page.getByRole('cell', { name: 'Describe la justificación y' }).click();
    await page.getByRole('button', { name: 'Vistas' }).click();
    await page.locator('html').click();
    await page.getByRole('button', { name: 'Vistas' }).click();
    await page.locator('html').click();
    await page.getByRole('textbox', { name: 'Buscar...' }).click();
    await page.getByRole('textbox', { name: 'Buscar...' }).fill('D');
    await page.getByRole('textbox', { name: 'Buscar...' }).fill('');
    await page.getByRole('button', { name: 'Enviar resultado' }).click();
    await page.getByRole('textbox', { name: 'Correo de destino' }).click();
    await page.getByRole('textbox', { name: 'Correo de destino' }).fill('jmanuelrardilla@gmail.com');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Ortografía' }).click();
    await page.getByRole('textbox', { name: 'Mensaje adicional' }).click();
    await page.getByRole('textbox', { name: 'Mensaje adicional' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Mensaje adicional' }).fill('L');
    await page.getByRole('textbox', { name: 'Mensaje adicional' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Mensaje adicional' }).fill('Lo escribio mal');
    await page.getByRole('button', { name: 'Enviar resultado' }).click();
    await page.getByRole('link', { name: 'Historial' }).click();
    await miFila.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'Reevaluar' }).click({ force: true });
    await page.getByRole('link', { name: 'Evaluacion' }).click();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'Eliminar' }).click();
    await page.getByPlaceholder('ELIMINAR').press('CapsLock');
    await page.getByPlaceholder('ELIMINAR').fill('ELIMINAR');
    await page.getByRole('button', { name: 'ELIMINAR' }).click();
    await page.locator('body').press('CapsLock');
    await page.getByRole('button', { name: /^AH\s.+\sadmin-/ }).click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();
});