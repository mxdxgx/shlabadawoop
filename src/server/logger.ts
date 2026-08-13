import winston from 'winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'debug' }),
    new winston.transports.File({
      filename: `${new Date().toISOString().split('T')[0]}.shlabadawoop.log`,
      level: 'debug',
      dirname: 'logs',
    }),
  ],
});
