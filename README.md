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

# Demo de CI/CD, Quality Gates y Playwright

Objetivo de la demo: mostrar como un cambio pasa por validaciones automaticas antes de integrarse a `master` o `main`, y como GitHub bloquea el merge cuando falla un test E2E.

## Mensaje principal para la capacitacion

El pipeline funciona como una puerta de calidad:

1. Valida que la app web tenga lo esperado.
2. Construye la app.
3. Levanta la app.
4. Ejecuta pruebas E2E con Playwright.
5. Publica reportes como artefactos.
6. Bloquea el merge si algun stage falla.

## Stages de la demo

```text
Stage 1 - Validar web
  - npm ci
  - npm run validate:web
  - npm run build:web
  - publica artefacto web-dist

Stage 2 - Pruebas E2E
  - instala Chromium
  - levanta la web
  - ejecuta Playwright
  - publica playwright-report, test-results y web-server-log

Stage 3 - Quality Gate
  - solo corre si Stage 1 y Stage 2 pasaron

Stage 4 - CD GitHub Pages
  - solo corre en push directo a master/main
  - no debe correr en pull request
```

## Importante sobre Stage 4

Si el Stage 4 falla, normalmente no significa que las pruebas fallaron.

Stage 4 es despliegue. Puede fallar por:

- GitHub Pages no esta configurado como `GitHub Actions`.
- El repositorio no tiene permisos de Pages.
- La cuenta u organizacion tiene restricciones de billing.
- El workflow usa `main`, pero tu rama principal se llama `master`.

Para la demo de Quality Gates, lo importante es que el PR quede bloqueado cuando falle:

- `Stage 1 - Validar web`
- `Stage 2 - Pruebas E2E`
- `Stage 3 - Quality Gate`

## Preparacion antes de la demo

En GitHub, configura proteccion de rama:

1. Entra al repositorio.
2. Ve a `Settings`.
3. Ve a `Branches`.
4. Crea una regla para `master` o `main`, segun tu rama principal.
5. Activa `Require status checks to pass before merging`.
6. Selecciona estos checks:
   - `Stage 1 - Validar web`
   - `Stage 2 - Pruebas E2E`
   - `Stage 3 - Quality Gate`
7. Activa `Require a pull request before merging`.

Resultado esperado: GitHub no deja integrar un PR si falla una validacion.

## Demo 1 - Camino feliz

Crear una rama:

```bash
git checkout -b feature/demo-login-ok
```

Hacer un cambio simple que no rompa nada. Por ejemplo, cambiar un texto visual secundario en `apps/web/src/index.html`:

```html
<p class="hint">Usuario de practica: admin@demo.com / Demo123!</p>
```

Por ejemplo:

```html
<p class="hint">Usuario de practica para la capacitacion: admin@demo.com / Demo123!</p>
```

Subir cambios:

```bash
git add .

## Practica: hacer fallar un PR hacia master

Esta practica sirve para demostrar que el Quality Gate bloquea la integracion cuando falla una prueba E2E.

### 1. Crear una rama nueva

Desde la rama principal:

```bash
git checkout master
git pull origin master
git checkout -b feature/demo-falla-login
```

### 2. Cambiar la pagina para romper el test

Abrir el archivo:

```text
apps/web/src/index.html
```

Buscar el boton:

```html
<button type="submit">Ingresar</button>
```

Cambiarlo por:

```html
<button type="submit">Entrar</button>
```

Este cambio rompe intencionalmente la prueba E2E porque Playwright esta buscando un boton con el texto `Ingresar`.

### 3. Subir el cambio

```bash
git add .
git commit -m "Change login button text"
git push -u origin feature/demo-falla-login
```

### 4. Crear Pull Request hacia master

En GitHub:

1. Ir al repositorio.
2. Crear un Pull Request desde `feature/demo-falla-login` hacia `master`.
3. Esperar a que corra GitHub Actions.

### 5. Resultado esperado

El pipeline debe comportarse asi:

```text
Stage 1 - Validar web      OK
Stage 2 - Pruebas E2E      FAIL
Stage 3 - Quality Gate     No corre o queda bloqueado
Stage 4 - CD GitHub Pages  No aplica para el PR
```

El PR no debe dejarse integrar a `master` si tienes configurada la proteccion de rama con checks obligatorios.

### 6. Ver el reporte del fallo

En GitHub Actions:

1. Entrar al workflow fallido.
2. Abrir el job `Stage 2 - Pruebas E2E`.
3. Revisar el error de Playwright.
4. Descargar el artefacto `playwright-report`.

El error esperado es que Playwright no encuentra:

```js
page.getByRole('button', { name: 'Ingresar' })
```

porque la pagina ahora muestra:

```text
Entrar
```

### 7. Corregir el PR

Volver a dejar el boton como estaba:

```html
<button type="submit">Ingresar</button>
```

Subir el arreglo:

```bash
git add .
git commit -m "Fix login button text"
git push
```

GitHub Actions correra nuevamente. Cuando los stages pasen, el PR quedara habilitado para integrarse a `master`.

