require('module-alias/register');

import { Telegraf } from 'telegraf';
import 'reflect-metadata';
import { Container, inject, injectable } from 'inversify';
import * as Sentry from '@sentry/node';
import { BotBuilder } from './botBuilder';
import {
  ICommand,
  StartCommand,
  BaseCommand,
  CatsCommand,
} from '@app/commands';
import {
  IConfigService,
  ConfigService,
  DatabaseService,
  ILoggerService,
  LoggerService,
} from '@app/services';
import { TYPES } from '@app/types';
import { IBotContext } from './context/context.interface';
import { IDatabaseService } from '@app/services';
import { IRatingController, RatingController } from '@app/features';

@injectable()
class App {
  bot: Telegraf<IBotContext>;
  commands: ICommand[] = [];

  constructor(
    @inject(TYPES.BotBuilder) private readonly botBuilder: BotBuilder,
    @inject(TYPES.StartCommand) private readonly startCommand: StartCommand,
    @inject(TYPES.BaseCommand) private readonly baseCommand: BaseCommand,
    @inject(TYPES.CatsCommand) private readonly catsCommand: CatsCommand,
    @inject(TYPES.IConfigService)
    private readonly configService: IConfigService,
    @inject(TYPES.ILoggerService) private readonly loggerService: ILoggerService
  ) {
    this.bot = botBuilder.get();
    this.commands.push(startCommand);
    this.commands.push(baseCommand);
    this.commands.push(catsCommand);
  }

  init() {
    this.loggerService.info('Init application');
    Sentry.init({ dsn: this.configService.get('SENTRY_DSN') });

    for (const command of this.commands) {
      command.handle();
    }
    this.bot.catch((err, ctx) => {
      if (err instanceof Error) {
        this.loggerService.info(err.message);
      }

      Sentry.captureException(err);
    });

    this.bot.launch();
  }
}

const appContainer = new Container();
appContainer.bind<App>(TYPES.App).to(App).inSingletonScope();
appContainer
  .bind<BotBuilder>(TYPES.BotBuilder)
  .to(BotBuilder)
  .inSingletonScope();
appContainer
  .bind<StartCommand>(TYPES.StartCommand)
  .to(StartCommand)
  .inSingletonScope();
appContainer
  .bind<BaseCommand>(TYPES.BaseCommand)
  .to(BaseCommand)
  .inSingletonScope();
appContainer
  .bind<CatsCommand>(TYPES.CatsCommand)
  .to(CatsCommand)
  .inSingletonScope();
appContainer
  .bind<IConfigService>(TYPES.IConfigService)
  .to(ConfigService)
  .inSingletonScope();
appContainer
  .bind<ILoggerService>(TYPES.ILoggerService)
  .to(LoggerService)
  .inSingletonScope();
appContainer
  .bind<IDatabaseService>(TYPES.IDatabaseService)
  .to(DatabaseService)
  .inSingletonScope();
appContainer
  .bind<IRatingController>(TYPES.ILikesController)
  .to(RatingController)
  .inSingletonScope();

const app = appContainer.get<App>(TYPES.App);
app.init();
