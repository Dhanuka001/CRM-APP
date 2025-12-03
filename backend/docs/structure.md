# Backend Folder Structure

## `src/`

Root of the application code. Holds the entry point (`server.js`) plus subdirectories for routes, controllers, middleware, and configuration helpers. Keeping everything under `src` keeps runtime and build artifacts separate.

### `src/server.js`

Bootstraps the Express app, applies middleware, connects the router, and starts listening on the configured port.

### `src/routes/`

Defines route collections and maps HTTP paths to controller actions. Each route file should set up a router instance and export it for inclusion by the entry point.

### `src/controllers/`

Holds the functions that encode business logic for a given route. Controllers receive requests, call services if needed, and craft responses.

### `src/middleware/`

Reusable middleware (e.g., logging, validation, auth) that can be applied globally or per-route to keep controllers focused on handling data.

### `src/config/`

Central place for application configuration (env vars, default values). Exported objects should be consumed by server, middleware, and other shared modules.

### `prisma/`

Contains `schema.prisma`, the canonical data model, datasource, and generator definitions for Prisma. Keeping it versioned makes migrations reproducible across environments.

## Naming convention

We use `camelCase` for file names that export a single function or object (e.g., `statusController.js`, `requestLogger.js`), while folders stay lowercase and descriptive. Core entry points such as `server.js` remain lowercase to match Node.js conventions.
