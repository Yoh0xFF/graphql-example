import winston from 'winston';

const { combine, timestamp, prettyPrint, json } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json(),
    prettyPrint({
      colorize: true
    })
  )
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}
