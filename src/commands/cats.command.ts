import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@app/types';
import { Command } from './command.abstract';
import { BotBuilder } from '@app/botBuilder';
import { ILoggerService } from '@app/services';
import { IRatingController } from '@app/features';

@injectable()
export class CatsCommand extends Command {
  constructor(
    @inject(TYPES.BotBuilder) protected readonly botBuilder: BotBuilder,
    @inject(TYPES.ILoggerService)
    protected readonly loggerService: ILoggerService,
    @inject(TYPES.ILikesController)
    protected readonly ratingController: IRatingController
  ) {
    super(botBuilder, loggerService, ratingController);
  }

  handle(): void {
    this.bot.command('cats', (ctx) => {
      this.sendPhoto(ctx, 'котэ');
    });
  }
}