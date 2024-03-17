import 'reflect-metadata';
import { injectable } from 'inversify';
import { Markup, Telegraf } from 'telegraf';
import { ICommand } from './command.interface';
import { BotBuilder } from '@app/botBuilder';
import { IBotContext } from '@app/context/context.interface';
import { IRatingController } from '@app/features/rating/controller.interface';
import { ILoggerService } from '@app/services';

@injectable()
export abstract class Command implements ICommand {
  protected bot: Telegraf<IBotContext>;
  
  constructor(
    protected readonly botBuilder: BotBuilder,
    protected readonly loggerService: ILoggerService,
    protected readonly ratingController: IRatingController
  ) {
    this.bot = botBuilder.get();
  }

  protected async sendPhoto(botContext: IBotContext, tag: string) {
    try {
      const rating = await this.ratingController.getRandom('image', tag);
      const newShows = rating.shows + 1;
      await this.ratingController.setShowsById(rating.id, newShows);

      await botContext.replyWithPhoto(
        rating.url,
        this.buildLikeMarkupMessage(
          rating.id,
          newShows,
          rating.likes,
          rating.dislikes
        )
      );
      this.loggerService.info('send photo with ID = ' + rating.id);
      await botContext.deleteMessage();
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.info(e.message);
        return;
      }
    }
  }

  protected async sendVideo(botContext: IBotContext, tag: string) {
    try {
      const rating = await this.ratingController.getRandom('video', tag);
      const newShows = rating.shows + 1;
      await this.ratingController.setShowsById(rating.id, newShows);

      await botContext.replyWithVideo(
        rating.url,
        this.buildLikeMarkupMessage(
          rating.id,
          newShows,
          rating.likes,
          rating.dislikes
        )
      );
      this.loggerService.info('send video with ID = ' + rating.id);
      await botContext.deleteMessage();
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.info(e.message);
        return;
      }
    }
  }

  protected buildLikeMarkupMessage(
    ratingId: number,
    showCount: number,
    likeCount: number,
    dislikeCount: number
  ) {
    const localLikeCounter = likeCount > 0 ? likeCount : '';
    const localDislikeCounter = dislikeCount > 0 ? dislikeCount : '';
    return Markup.inlineKeyboard([
      Markup.button.callback('👀 ' + showCount, 'test'),
      Markup.button.callback(
        '👍 ' + localLikeCounter,
        'rating_like#' + ratingId
      ),
      Markup.button.callback(
        '👎 ' + localDislikeCounter,
        'rating_dislike#' + ratingId
      ),
      Markup.button.callback('📋 ', 'rating_info#' + ratingId),
    ]);
  }

  abstract handle(): void;
}
