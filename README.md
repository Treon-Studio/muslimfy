# Hadist App

A project setup for building web and mobile applications using LynxJS.

## Requirements

- Node.js >= 18
- [pnpm](https://pnpm.io/) >= 8
- A `favicon.ico` file in `src/assets` (required for web build; a placeholder is provided by default)

> **Note:** If you don't have pnpm installed, run:
> ```sh
> npm install -g pnpm
> ```

## Installation

```sh
pnpm install
```

## Scripts

### Troubleshooting

- **Missing favicon error:**
  If you get a build error about missing `favicon.ico`, ensure there is a valid favicon at `src/assets/favicon.ico`.

---

## Scripts (use pnpm)

- **React-router import errors:**
  All router hooks and components must be imported from `react-router-dom` (not `react-router`). For example:
  ```js
  import { useNavigate, useParams, MemoryRouter, Routes, Route } from 'react-router-dom';
  ```

- **Nodemon crash (too many arguments for 'build'):**
  This does not affect the dev server. The web app will still be available on the port shown in the terminal.

---

### Example commands

- Install dependencies:
  ```sh
  pnpm install
  ```
- Build all:
  ```sh
  pnpm run build
  ```
- Build mobile app:
  ```sh
  pnpm run build:mobile
  ```
- Build client app:
  ```sh
  pnpm run build:client
  ```
- Develop client app:
  ```sh
  pnpm run dev:client
  ```
- Develop mobile app:
  ```sh
  pnpm run dev:mobile
  ```

- **Mobile dev TTY error:**
  You may see a `ERR_TTY_INIT_FAILED` error when running the mobile dev server. This is safe to ignore if the server URL is printed and accessible.

### Building

- **Build All (Mobile, Client and Desktop App):**

  ```sh
  npm run build
  ```

  This runs the `build:mobile` and `build:client` scripts concurrently.

- **Build Mobile App:**

  ```sh
  npm run build:mobile
  ```

  Uses `rspeedy` to build the mobile app with the configuration file `./config/lynx.mobile.ts`.

- **Build Client App:**

  ```sh
  npm run build:client
  ```

  Uses `rspeedy` and `rsbuild` to build the web and client apps with the configuration files `./config/lynx.web.ts` and `./config/lynx.client.ts`.

  - **Build Desktop App:**

  ```sh
  npm run build:app
  ```

  Builds the web app, then builds the Electron client using `./config/lynx.app.ts`, and packages it using `electron-builder`.

### Development

- **Develop Mobile App:**

  ```sh
  npm run dev:mobile
  ```

  Uses `rspeedy` to start a dev server with hot-reloading using `./config/lynx.mobile.ts`.

- **Develop Client App:**

  ```sh
  npm run dev:client
  ```

  Uses `concurrently` to watch changes and rebuild the web app with `rspeedy` and start a client dev server with `rsbuild`.

> [!NOTE]
> The dev server will start on port 3000, or the next available port (e.g., 3001, 3002, etc.) if 3000 is in use. Check your terminal output for the correct port.

- **Develop Desktop App:**

  ```sh
  npm run dev:app
  ```

  Watches and rebuilds the web source if needed, then launches the Electron app with the bundled web assets.

> [!NOTE]
> It will use the `build/web` distribution.

### Preview

- **Preview Mobile App:**

  ```sh
  npm run preview:mobile
  ```

  Builds the mobile app and serves it using `rspeedy` with `./config/lynx.mobile.ts`.

- **Preview Client App:**

  ```sh
  npm run preview:client
  ```

> [!IMPORTANT]
> If you're using your distribution to host it, keep in mind that the `output.assetPrefix` is set to '/'. If you configure your client with a sub-path, make sure to update the `output.assetPrefix` in the [lynx.client.ts](./config/lynx.client.ts) config file to match the new route.
> For example, if your route is `https://example.com/app`, you should set `output.assetPrefix` to '/app'.

  Builds the client app and serves it using `rsbuild` with `./config/lynx.client.ts`.

> [!NOTE]
> It will use the `build/client` distribution.

### Code Quality

- **Check Code Quality and Apply Fixes:**

  ```sh
  npm run check
  ```

  Uses `biome` to lint and apply fixes to the codebase.

- **Format Code:**

  ```sh
  npm run format
  ```

  Formats code using `biome`.

## Dependencies

- **React (v19.1.0) & ReactDOM (v19.1.0):** React framework for building UI.
- **@lynx-js/react, @lynx-js/web-core, @lynx-js/web-elements:** LynxJS libraries for creating web and mobile apps.

## Dev Dependencies

- **@biomejs/biome:** Linting and formatting tool.
- **@lynx-js/qrcode-rsbuild-plugin, @lynx-js/react-rsbuild-plugin:** Plugins for enhancing LynxJS build.
- **electron:** Enables building cross-platform desktop apps using web technologies via Chromium and Node.js.
- **electron-builder:** Packages and distributes Electron apps for Windows, macOS, and Linux with custom icons and configurations.
- **@lynx-js/rspeedy:** Tool for faster builds.
- **@rsbuild/core, @rsbuild/plugin-react:** Build system components.
- **Concurrently:** Tool for running multiple commands concurrently.
- **Nodemon:** For auto-restarting the server during development.
- **TypeScript:** Type checking and static analysis.
