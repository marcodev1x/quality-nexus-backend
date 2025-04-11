import { EnvsVars } from "./src/EnvsVars";

const knexcfg = {
  development: {
    client: "mysql2",
    connection: {
      host: EnvsVars.DB_HOST,
      port: EnvsVars.DB_PORT,
      user: EnvsVars.DB_USER,
      password: EnvsVars.DB_PASSWORD,
      database: EnvsVars.DB_DATABASE,
    },
    migrations: {
      directory: "./knex/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./knex/seeds",
      extensions: "ts",
    },
  },
};

export default knexcfg;
