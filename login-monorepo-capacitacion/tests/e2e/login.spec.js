const { test, expect } = require('@playwright/test');

test.describe('Login - ejemplos basicos', () => {
  test('permite iniciar sesion con credenciales validas', async ({ page }) => {
    await page.goto('index.html');

    await page.getByLabel('Correo').fill('admin@demo.com');
    await page.getByLabel('Contrasena').fill('Demo123!');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeVisible();
    await expect(page.getByText('Sesion iniciada correctamente.')).toBeVisible();
    await expect(page.getByTestId('user-email')).toHaveText('admin@demo.com');
  });

  test('muestra error cuando las credenciales son invalidas', async ({ page }) => {
    await page.goto('index.html');

    await page.getByLabel('Correo').fill('admin@demo.com');
    await page.getByLabel('Contrasena').fill('ClaveIncorrecta');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Correo o contrasena incorrectos.');
    await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeHidden();
  });

  test('permite cerrar sesion y volver al formulario', async ({ page }) => {
    await page.goto('index.html');

    await page.getByLabel('Correo').fill('admin@demo.com');
    await page.getByLabel('Contrasena').fill('Demo123!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.getByRole('button', { name: 'Cerrar sesion' }).click();

    await expect(page.getByRole('heading', { name: 'Ingreso al sistema' })).toBeVisible();
    await expect(page.getByLabel('Correo')).toBeVisible();
  });
});
