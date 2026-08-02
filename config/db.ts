import { Sequelize } from "sequelize";
import { env } from "./env.ts";

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  dialect: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  logging: env.NODE_ENV === "development" ? console.log : false,
});

export default sequelize;
