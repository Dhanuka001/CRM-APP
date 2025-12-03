# Configuration & Environment Loading Plan

## Env loading approach
We will rely on `dotenv` inside `src/config/index.js` to load a `.env` file (when present) plus all standard `process.env` values. This keeps secrets and machine-specific overrides outside source control while still making every config getter use the same pipeline.

## Config values
- `PORT`: defines where the Express server listens; defaults to `8080`.
- `NODE_ENV`: drives environment-specific behavior; defaults to `development`.
- `DATABASE_URL`: URL of the CRM database; defaults to `postgres://localhost:5432/crm` for local development.
- `JWT_SECRET`: secret key for signing authentication tokens; there is no default and it must be supplied.

## Missing env var rule
When a value is marked as required (`JWT_SECRET`), the config module will throw a descriptive error during startup so the application never runs without that critical secret. Optional values may use reasonable defaults, but we should still document them so operators know what to override in production.
