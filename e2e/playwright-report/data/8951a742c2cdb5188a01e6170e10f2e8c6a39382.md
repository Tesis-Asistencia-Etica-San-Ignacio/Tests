# Test info

- Name: test
- Location: C:\Users\jmanu\OneDrive\Escritorio\backUp Jose Manuel\Universidad\Tesis\tests\e2e\tests\evaluator.spec.ts:4:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/auth", waiting until "load"

    at C:\Users\jmanu\OneDrive\Escritorio\backUp Jose Manuel\Universidad\Tesis\tests\e2e\tests\evaluator.spec.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import path from 'path';
   3 |
   4 | test('test', async ({ page }) => {
>  5 |     await page.goto('http://localhost:3000/auth');
     |                ^ Error: page.goto: Target page, context or browser has been closed
   6 |     await page.getByRole('textbox', { name: 'Ingresa tu correo' }).click();
   7 |     await page.getByRole('textbox', { name: 'Ingresa tu correo' }).fill('admin-husi@gmail.com');
   8 |     await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).click();
   9 |     await page.getByRole('textbox', { name: 'Ingresa tu contraseña' }).fill('Password123*');
   10 |     await page.getByRole('button').filter({ hasText: /^$/ }).click();
   11 |     await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
   12 |     await page.getByRole('button', { name: 'Ajustes' }).click();
   13 |     await page.getByRole('link', { name: 'Inteligencia artificial' }).click();
   14 |     await page.getByRole('combobox').first().click();
   15 |     await page.getByRole('option', { name: 'gemini' }).click();
   16 |     await page.getByRole('button', { name: 'Seleccionar proveedor' }).click();
   17 |     await page.getByRole('button', { name: 'Cambiar' }).click();
   18 |     await page.getByRole('combobox').filter({ hasText: 'model' }).click();
   19 |     await page.getByRole('option', { name: 'gemini-2.0-flash', exact: true }).click();
   20 |     await page.getByRole('button', { name: 'Cambiar Modelo de IA' }).click();
   21 |     await page.getByRole('button', { name: 'Sí, actualizar' }).click();
   22 |     await page.getByRole('button', { name: 'Reiniciar Prompts' }).click();
   23 |     await page.getByPlaceholder('REINICIAR').press('CapsLock');
   24 |     await page.getByPlaceholder('REINICIAR').fill('REINICIAR');
   25 |     await page.getByRole('button', { name: 'Reiniciar' }).click();
   26 |     await page.getByRole('listitem').filter({ hasText: /^Apariencia$/ }).getByRole('link').click();
   27 |     await page.locator('div:nth-child(2) > .gap-2 > div > div > div:nth-child(2)').click();
   28 |     await page.getByRole('button', { name: 'Actualizar preferencias' }).click();
   29 |     await page.getByRole('complementary').getByRole('link', { name: 'Cuenta' }).click();
   30 |     await page.getByRole('textbox', { name: 'Nombre' }).click();
   31 |     await page.getByRole('textbox', { name: 'Nombre' }).fill('Admin-');
   32 |     await page.getByRole('textbox', { name: 'Nombre' }).press('CapsLock');
   33 |     const uniqueName = `Admin-${Date.now()}`;
   34 |     await page.getByRole('textbox', { name: 'Nombre' }).fill(uniqueName);
   35 |     await page.getByRole('button', { name: 'Actualizar Cuenta' }).click();
   36 |     await page.getByRole('button', { name: 'Sí, actualizar' }).click();
   37 |     await page.getByRole('complementary').getByRole('link', { name: 'Apariencia' }).click();
   38 |     await page.locator('.flex > .h-2').first().click();
   39 |     await page.getByRole('button', { name: 'Actualizar preferencias' }).click();
   40 |     await page.getByRole('link', { name: 'Subir archivos' }).click();
   41 |     await page.getByText('Click para subir archivos o arrastra y sueltahasta 10 archivos PDF/Word').click();
   42 |     const pdfPath = path.resolve(__dirname, 'auth', 'fixtures', 'IFC 489 INICIAL.pdf');
   43 |
   44 |     await page.locator('#dropzone-file').setInputFiles(pdfPath);
   45 |     await page.getByRole('row', { name: 'IFC 489 INICIAL.pdf 220.6 KB' }).getByRole('button').click();
   46 |     await page.getByText('Click para subir archivos o arrastra y sueltahasta 10 archivos PDF/Word').click();
   47 |     await page.locator('#dropzone-file').setInputFiles(pdfPath);
   48 |     await page.getByRole('button', { name: 'Subir Archivos' }).click();
   49 |     await page.getByRole('button', { name: 'Vistas' }).click();
   50 |     await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
   51 |     await page.getByRole('button', { name: 'Estado' }).first().click();
   52 |     await page.getByRole('option', { name: 'Pendiente' }).locator('div').click();
   53 |     await page.getByRole('option', { name: 'En curso' }).locator('div').click();
   54 |     await page.getByRole('option', { name: 'Evaluado' }).locator('div').click();
   55 |     await page.getByRole('button', { name: 'Borrar filtros' }).click();
   56 |     await page.getByRole('button', { name: 'Aprobado' }).first().click();
   57 |     await page.getByRole('option', { name: 'Aprobado', exact: true }).locator('div').click();
   58 |     await page.getByRole('option', { name: 'No aprobado' }).locator('div').click();
   59 |     await page.getByRole('option', { name: 'Aprobado', exact: true }).locator('div').click();
   60 |     await page.getByRole('button', { name: 'Borrar filtros' }).click();
   61 |     const miFila = page.getByRole('row', { name: /IFC 489 INICIAL\.pdf/ });
   62 |     await miFila.getByRole('button', { name: 'Open menu' }).click();
   63 |     await page.getByRole('menuitem', { name: 'Editar' }).click();
   64 |     await page.getByRole('textbox', { name: 'Correo del estudiante' }).click();
   65 |     await page.getByRole('textbox', { name: 'Correo del estudiante' }).fill('jmanuelrardilla@gmail.com');
   66 |     await page.getByRole('textbox', { name: 'Tipo de error' }).click();
   67 |     await page.getByRole('textbox', { name: 'Tipo de error' }).press('CapsLock');
   68 |     await page.getByRole('textbox', { name: 'Tipo de error' }).fill('Muy malo');
   69 |     await page.getByRole('button', { name: 'Guardar cambios' }).click();
   70 |     await miFila.getByRole('button', { name: 'Open menu' }).click();
   71 |     await page.getByRole('menuitem', { name: 'Evaluar' }).click({ force: true });
   72 |     await page.getByRole('cell', { name: 'Contiene versión y fecha del' }).click();
   73 |     await page.getByText('Contiene título del proyecto').click();
   74 |     await page.getByRole('cell', { name: 'Contiene título del proyecto' }).click();
   75 |     await page.getByText('Describe la justificación y').click();
   76 |     await page.getByRole('cell', { name: 'Describe la justificación y' }).click();
   77 |     await page.getByRole('button', { name: 'Vistas' }).click();
   78 |     await page.locator('html').click();
   79 |     await page.getByRole('button', { name: 'Vistas' }).click();
   80 |     await page.locator('html').click();
   81 |     await page.getByRole('textbox', { name: 'Buscar...' }).click();
   82 |     await page.getByRole('textbox', { name: 'Buscar...' }).fill('D');
   83 |     await page.getByRole('textbox', { name: 'Buscar...' }).fill('');
   84 |     await page.getByRole('button', { name: 'Enviar resultado' }).click();
   85 |     await page.getByRole('textbox', { name: 'Correo de destino' }).click();
   86 |     await page.getByRole('textbox', { name: 'Correo de destino' }).fill('jmanuelrardilla@gmail.com');
   87 |     await page.getByRole('combobox').click();
   88 |     await page.getByRole('option', { name: 'Ortografía' }).click();
   89 |     await page.getByRole('textbox', { name: 'Mensaje adicional' }).click();
   90 |     await page.getByRole('textbox', { name: 'Mensaje adicional' }).press('CapsLock');
   91 |     await page.getByRole('textbox', { name: 'Mensaje adicional' }).fill('L');
   92 |     await page.getByRole('textbox', { name: 'Mensaje adicional' }).press('CapsLock');
   93 |     await page.getByRole('textbox', { name: 'Mensaje adicional' }).fill('Lo escribio mal');
   94 |     await page.getByRole('button', { name: 'Enviar resultado' }).click();
   95 |     await page.getByRole('link', { name: 'Historial' }).click();
   96 |     await miFila.getByRole('button', { name: 'Open menu' }).click();
   97 |     await page.getByRole('menuitem', { name: 'Reevaluar' }).click({ force: true });
   98 |     await page.getByRole('link', { name: 'Evaluacion' }).click();
   99 |     await page.getByRole('button', { name: 'Open menu' }).click();
  100 |     await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  101 |     await page.getByPlaceholder('ELIMINAR').press('CapsLock');
  102 |     await page.getByPlaceholder('ELIMINAR').fill('ELIMINAR');
  103 |     await page.getByRole('button', { name: 'ELIMINAR' }).click();
  104 |     await page.locator('body').press('CapsLock');
  105 |     await page.getByRole('button', { name: /^AH\s.+\sadmin-/ }).click();
```