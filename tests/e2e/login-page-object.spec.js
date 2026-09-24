const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

test.describe('Login - patron Page Object', () => {
  test('inicia sesion usando una clase reutilizable', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin@demo.com', 'Demo123!');

    await expect(loginPage.welcomeTitle).toBeVisible();
  });

  test('valida el mensaje de error usando Page Object', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin@demo.com', '123456');

    await expect(loginPage.alert).toHaveText('Correo o contrasena incorrectos.');
  });
});
