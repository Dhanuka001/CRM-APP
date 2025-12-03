require('dotenv').config();

const requireEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
};

const config = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/crm',
  jwtSecret: requireEnv('JWT_SECRET'),
};

module.exports = config;
