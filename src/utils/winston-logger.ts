import * as path from 'path';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => `${info.message}`),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../errorLogs/info.log'),
      level: 'info',
      maxsize: 500,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;
