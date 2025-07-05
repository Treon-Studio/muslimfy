# Muslimfy

This is the web application for Muslimfy, a modern and user-friendly app for Muslims. This project is built with Astro, React, and Tailwind CSS v4.

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/         # Static assets like images and fonts
├── src/
│   ├── components/ # Reusable components (Astro, React)
│   ├── layouts/    # Page layouts
│   ├── pages/      # Application pages/routes
│   └── styles/     # Global styles
└── package.json
```

- **`src/pages/`**: Contains the pages for your application. Each `.astro` file in this directory becomes a page.
- **`src/layouts/`**: Holds layout components that define the structure of your pages.
- **`src/components/`**: The place for all your reusable UI components, whether they are Astro components or React components.
- **`public/`**: Any static assets, like images, can be placed in this directory and will be copied to the build output as-is.

## Development Commands

All commands are run from the root of the project from a terminal. This project uses `pnpm` as the package manager.

| Command           | Action                                                |
| :---------------- | :---------------------------------------------------- |
| `pnpm install`    | Installs dependencies                                 |
| `pnpm dev`        | Starts the local development server at `localhost:4321` |
| `pnpm build`      | Builds your production site to `./dist/`              |
| `pnpm preview`    | Previews your build locally before deploying          |
| `pnpm astro ...`  | Run Astro CLI commands like `astro add`, `astro check`  |

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
