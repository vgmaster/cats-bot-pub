import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BotBuilder } from '@app/botBuilder';
import { TYPES } from '@app/types';
import { IRatingController } from '@app/features/rating/controller.interface';
import { ILoggerService } from '@app/services';
import { Command } from './command.abstract';

@injectable()
export class BaseCommand extends Command {
  constructor(
    @inject(TYPES.BotBuilder) protected readonly botBuilder: BotBuilder,
    @inject(TYPES.ILoggerService)
    protected readonly loggerService: ILoggerService,
    @inject(TYPES.ILikesController)
    protected readonly ratingController: IRatingController
  ) {
    super(botBuilder, loggerService, ratingController);
  }

  handle = () => {
    this.bot.command('liked', async (ctx) => {
      const rating = await this.ratingController.getLiked();

      if (!rating) return;

      await ctx.deleteMessage();
      await ctx.replyWithPhoto(
        rating.url,
        this.buildLikeMarkupMessage(
          rating.id,
          rating.shows,
          rating.likes,
          rating.dislikes
        )
      );
      this.loggerService.info('send liked photo with ID = ' + rating.id);
    });

    this.bot.command('top3', async (ctx) => {
      type TMedias = {
        type: 'photo';
        media: string;
        caption: string;
      };
      const medias: TMedias[] = [];
      const ratings = await this.ratingController.getTop(3);

      if (ratings.length === 0) return;
      ratings.forEach((rating) => {
        medias.push({
          media: rating.url,
          caption: '👍 ' + rating.likes.toString(),
          type: 'photo',
        });
      });

      await ctx.deleteMessage();
      await ctx.replyWithMediaGroup(medias);
    });

    this.bot.action(/rating_like#+/, async (ctx) => {
      const args = ctx.match.input.split('#');
      const ratingId = Number(args[1]);
      if (ratingId === undefined || ratingId < 0) return;
      const rating = await this.ratingController.getRatingById(ratingId);

      if (!rating) return;

      const newLikesCount = rating.likes + 1;
      await this.ratingController.setLikesById(ratingId, newLikesCount);

      ctx.editMessageReplyMarkup(
        this.buildLikeMarkupMessage(
          ratingId,
          rating.shows,
          newLikesCount,
          rating.dislikes
        ).reply_markup
      );
    });

    this.bot.action(/rating_dislike#+/, async (ctx) => {
      const args = ctx.match.input.split('#');
      const ratingId = Number(args[1]);
      if (ratingId === undefined || ratingId < 0) return;
      const rating = await this.ratingController.getRatingById(ratingId);

      if (!rating) return;

      const newDislikesCount = rating.dislikes + 1;
      await this.ratingController.setDislikesById(ratingId, newDislikesCount);

      ctx.editMessageReplyMarkup(
        this.buildLikeMarkupMessage(
          ratingId,
          rating.shows,
          rating.likes,
          newDislikesCount
        ).reply_markup
      );
    });

    this.bot.action(/rating_info#+/, async (ctx) => {
      const args = ctx.match.input.split('#');
      const ratingId = Number(args[1]);
      if (ratingId === undefined || ratingId < 0) return;
      const rating = await this.ratingController.getRatingById(ratingId);

      if (!rating) return;

      if (
        ctx.update.callback_query.message &&
        ctx.update.callback_query.message.message_id
      ) {
        const replyMessageId = ctx.update.callback_query.message.message_id;
        ctx.replyWithHTML(`url: ${rating.url}\r\ntags: ${rating.raw_tags}`, {
          reply_parameters: {
            message_id: replyMessageId,
          },
        });
      }
    });
  };
}
