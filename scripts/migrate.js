require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const environment = process.env.NODE_ENV || "development";
const config = require("../config/config")[environment];

if (!config) {
  throw new Error(`Unsupported NODE_ENV: ${environment}`);
}

function createSequelize() {
  if (config.use_env_variable) {
    const databaseUrl = process.env[config.use_env_variable];

    if (!databaseUrl) {
      throw new Error(`${config.use_env_variable} is required for ${environment}`);
    }

    return new Sequelize(databaseUrl, config);
  }

  return new Sequelize(config.database, config.username, config.password, config);
}

function normalizeTableName(table) {
  if (typeof table === "string") return table;
  return table.tableName || table.table_name || table.name;
}

async function ensureMetadataTable(queryInterface) {
  const tables = await queryInterface.showAllTables();
  const exists = tables.some(
    (table) => normalizeTableName(table) === "SequelizeMeta",
  );

  if (exists) return;

  await queryInterface.createTable("SequelizeMeta", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
  });
}

async function run() {
  const sequelize = createSequelize();
  const queryInterface = sequelize.getQueryInterface();
  const migrationsDirectory = path.join(__dirname, "..", "migrations");

  try {
    await sequelize.authenticate();
    await ensureMetadataTable(queryInterface);

    const [executedRows] = await sequelize.query(
      'SELECT "name" FROM "SequelizeMeta" ORDER BY "name" ASC',
    );
    const executed = new Set(executedRows.map((row) => row.name));

    const migrations = fs
      .readdirSync(migrationsDirectory)
      .filter((filename) => filename.endsWith(".js"))
      .sort();

    const pending = migrations.filter((filename) => !executed.has(filename));

    if (pending.length === 0) {
      console.log("Database is already up to date.");
      return;
    }

    for (const filename of pending) {
      const migrationPath = path.join(migrationsDirectory, filename);
      const migration = require(migrationPath);

      if (typeof migration.up !== "function") {
        throw new Error(`Migration ${filename} does not export an up() function`);
      }

      console.log(`Running migration: ${filename}`);
      await migration.up(queryInterface, Sequelize);
      await queryInterface.bulkInsert("SequelizeMeta", [{ name: filename }]);
    }

    console.log(`Applied ${pending.length} migration(s).`);
  } finally {
    await sequelize.close();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
