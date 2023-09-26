import { Sequelize } from 'sequelize';
import { dbConfig } from "../config/db.config";
import logger from "../utils/winston-logger";

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: "postgres",
    logging: false,
    timezone: "+00:00",
    pool: dbConfig.pool,
    port: dbConfig.PORT
  }
)
sequelize.authenticate().then((error) => {
  console.log('*========== Sequelize connection eshtablished =========*');
}).catch(err => {
  console.error('*========== Sequelize connection Error =========*', err);
});

export default sequelize

