import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILoggerService } from './logger.interface';
import { Logger, pino } from 'pino';

@injectable()
export class LoggerService implements ILoggerService {
  private logger: Logger;

  constructor() {
    this.logger = pino({
      level: "info",
      transport: {
        targets: [
          {
            level: 'info',
            target: 'pino-pretty',
            options: {}
          },
          {
            level: 'trace',
            target: 'pino/file',
            options: { destination: './data/app.log' }
          }
        ],
      },
    });
  }

  info(data: string): void {
    this.logger.info(data);
  }

}