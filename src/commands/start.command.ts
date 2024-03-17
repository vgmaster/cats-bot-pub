import { Markup, Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IBotContext } from '@app/context/context.interface';
import { ICommand } from './command.interface';
import { TYPES } from '@app/types';
import { BotBuilder } from '@app/botBuilder';

@injectable()
export class StartCommand implements ICommand {
  bot: Telegraf<IBotContext>;

  constructor(
    @inject(TYPES.BotBuilder) private readonly botBuilder: BotBuilder
  ) {
    this.bot = botBuilder.get();
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply(
        'Всё хорошо?',
        Markup.inlineKeyboard([
          Markup.button.callback('👍', 'start_like'),
          Markup.button.callback('👎', 'start_dislike'),
        ])
      );
    });

    this.bot.action('start_like', (ctx) => {
      ctx.reply('Хорошо!');
    });

    this.bot.action('start_dislike', (ctx) => {
      ctx.reply('Плохо!');
    });
  }
}
