import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  HOST: process.env.DB_HOST as string || "localhost",
  USER: process.env.DB_USER as string || "root",
  PASSWORD: process.env.DB_PASSWORD as string || "root",
  DB: process.env.DB_DATABASE as string || "postgres",
  dialect: "postgres" as "postgres",
  PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
