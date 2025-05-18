# Test puntual
npx playwright test e2e/tests/auth/registry.spec.ts --headed

# Ejecuta toda la suite
npx playwright test

# Ver el reporte HTML
npx playwright show-report

# Generar pruebas
npx playwright codegen http://localhost:3000/auth --output=e2e/tests/x.spec.ts

admin-husi@gmail.com
Password123*

const uniqueEmail = `testuser_${Date.now()}@example.com`;
await page.getByRole('textbox', { name: 'Ingresa tu correo' }).fill(uniqueEmail);