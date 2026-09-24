# Login Demo - Monorepo con Playwright, CI/CD y Quality Gates

Este proyecto esta pensado para una capacitacion donde se quiere separar la pagina web de la automatizacion E2E.

## Estructura recomendada

```text
login-monorepo-capacitacion/
├── apps/
│   └── web/
│       ├── src/
│       │   └── index.html
│       ├── scripts/
│       │   ├── build.js
│       │   ├── static-server.js
│       │   └── validate.js
│       └── package.json
├── tests/
│   └── e2e/
│       ├── pages/
│       │   └── LoginPage.js
│       ├── login.spec.js
│       ├── login-page-object.spec.js
│       ├── package.json
│       └── playwright.config.js
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── package.json
├── package-lock.json
└── README.md
```

## Por que esta estructura

- `apps/web`: contiene la aplicacion que se prueba.
- `tests/e2e`: contiene solo la automatizacion E2E.
- `.github/workflows`: contiene el pipeline CI/CD.
- `package.json` raiz: orquesta comandos comunes del monorepo.

## Instalacion

```bash
npm install
npx playwright install chromium
```

## Ejecutar local

Levantar la web:

```bash
npm run start:web
```

Ejecutar pruebas E2E en otra terminal:

```bash
npm run test:e2e
```

Modo visible para capacitacion:

```bash
npm run test:e2e:headed
```

Modo interactivo:

```bash
npm run test:e2e:ui
```

## Stages del pipeline

### Stage 1 - Validar web

Ejecuta:

```bash
npm run validate:web
npm run build:web
```

Quality Gate:

- La pagina debe contener textos y atributos esperados para la practica.
- El build debe generar `apps/web/dist`.

Artefacto:

- `web-dist`

### Stage 2 - Pruebas E2E

Ejecuta:

```bash
npm run test:e2e
```

Quality Gate:

- No se permite `test.only` en CI.
- Todas las pruebas E2E deben pasar.
- Si falla una prueba, Playwright guarda screenshot, video y trace segun configuracion.

Artefactos:

- `playwright-report`
- `e2e-test-results`
- `web-server-log`

### Stage 3 - Quality Gate

Este job depende de los stages anteriores. Si alguno falla, este stage no corre y el pipeline queda fallido.

### Stage 4 - CD GitHub Pages

Solo corre cuando haces push a `main`.

Despliega:

```text
apps/web/dist
```

## Como subirlo a GitHub

```bash
git init
git add .
git commit -m "Add login monorepo with Playwright CI/CD"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## Configuracion de GitHub Pages

En GitHub:

1. Ve a `Settings`.
2. Entra a `Pages`.
3. En `Build and deployment`, selecciona `GitHub Actions`.

Con eso, el job `deploy` publicara la pagina cuando el pipeline pase en `main`.

## Quality Gate recomendado en GitHub

En GitHub, configura una regla de proteccion para `main`:

1. Ve a `Settings`.
2. Entra a `Branches`.
3. Agrega una regla para `main`.
4. Activa `Require status checks to pass before merging`.
5. Selecciona como checks requeridos:
   - `Stage 1 - Validar web`
   - `Stage 2 - Pruebas E2E`
   - `Stage 3 - Quality Gate`

Asi ningun pull request se puede mezclar si falla la validacion o las pruebas E2E.

## Practica sugerida para la capacitacion

1. Crear un pull request con un cambio pequeno en el login.
2. Revisar los stages del pipeline.
3. Descargar el artefacto `playwright-report`.
4. Provocar un fallo cambiando el texto del boton `Ingresar`.
5. Mostrar como falla el Quality Gate E2E.
6. Corregir el cambio y volver a ejecutar el pipeline.
