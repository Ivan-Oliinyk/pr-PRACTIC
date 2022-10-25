import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export function setupLogger(): LoggerService {
  const colorizer = winston.format.colorize();
  return WinstonModule.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
          winston.format.printf(msg =>
            colorizer.colorize(
              msg.level,
              `${msg.timestamp} - [${msg.level}] : ${msg.message} `,
            ),
          ),
        ),
      }),

      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //

      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
}
