class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Correo');
    this.passwordInput = page.getByLabel('Contrasena');
    this.submitButton = page.getByRole('button', { name: 'Ingresar' });
    this.alert = page.getByRole('alert');
    this.welcomeTitle = page.getByRole('heading', { name: 'Bienvenido' });
    this.userEmail = page.getByTestId('user-email');
    this.logoutButton = page.getByRole('button', { name: 'Cerrar sesion' });
  }

  async goto() {
    await this.page.goto('index.html');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
