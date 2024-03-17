import { Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { limit } from '@grammyjs/ratelimiter';
import 'reflect-metadata';
import { IConfigService } from '@app/services/config';
import { TYPES } from '@app/types';
import { IBotContext } from './context/context.interface';

@injectable()
export class BotBuilder {
  bot: Telegraf<IBotContext>;

  constructor(
    @inject(TYPES.IConfigService) private readonly configService: IConfigService
  ) {
    const limitConfig = {
      window: 1000,
      limit: 1,
      onLimitExceeded: async (ctx: IBotContext) => {
        await ctx.reply('Слишком быстро, необходимо подождать!');
      },
    };
    this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
    this.bot.use(limit(limitConfig));
  }

  public get() {
    return this.bot;
  }
}
