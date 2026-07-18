require("dotenv").config();

const databaseSslEnabled = process.env.DB_SSL === "true";

const sharedConfig = {
  dialect: process.env.DB_DIALECT || "postgres",
  port: Number(process.env.DB_PORT || 5432),
  logging: false,
};

module.exports = {
  development: {
    ...sharedConfig,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
  test: {
    ...sharedConfig,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || null,
    database: `${process.env.DB_DATABASE}_test`,
    host: process.env.DB_HOST,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions: databaseSslEnabled
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
};
