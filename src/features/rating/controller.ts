import { inject, injectable } from 'inversify';
import { IDatabaseService } from '@app/services';
import { TYPES } from '@app/types';
import { IRating, TRatingType } from './model';
import { IRatingController } from './controller.interface';

@injectable()
export class RatingController implements IRatingController {
  private db: any;

  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly databaseService: IDatabaseService
  ) {
    this.db = databaseService.get();
  }

  getRatingById = async (id: number): Promise<IRating> => {
    const rating = await this.db.from('ratings').where({ id: id }).first();
    return rating;
  };

  getRatingByUrl = async (url: string): Promise<IRating> => {
    const rating = await this.db.from('ratings').where({ url }).first();
    return rating;
  };

  addRating = async (url: string, type: TRatingType, tag: string): Promise<number[]> => {
    const rating = await this.db
      .insert({
        url,
        resource_type: type,
        tag,
        shows: 1,
        likes: 0,
        dislikes: 0,
        is_visible: true,
        raw_tags: '',
        created_at: Date.now(),
        updated_at: Date.now(),
      })
      .into('ratings');
    return rating;
  };

  setLikesById = async (id: number, likesCount: number): Promise<void> => {
    await this.db('ratings')
      .update({ likes: likesCount, updated_at: (new Date()) })
      .where({ id: id });
  };

  setDislikesById = async (
    id: number,
    dislikesCount: number
  ): Promise<void> => {
    await this.db('ratings')
      .update({ dislikes: dislikesCount, updated_at: (new Date()) })
      .where({ id: id });
  };

  setShowsById = async (id: number, showsCount: number): Promise<void> => {
    await this.db('ratings')
      .update({ shows: showsCount, updated_at: (new Date()) })
      .where({ id: id });
  };

  getTop = async (count: number): Promise<IRating[]> => {
    const ratings = await this.db('ratings')
      .where({ resource_type: 'image' })
      .orderBy('likes', 'desc')
      .limit(count);
    return ratings;
  };

  getLiked = async () => {
    const rating = await this.db
      .from('ratings')
      .where({ resource_type: 'image' })
      .where('likes', '>', 0)
      .orderByRaw('RANDOM()')
      .first();
    return rating;
  };

  public getRandom = async (type: TRatingType, tag: string) => {
    const rating = await this.db
      .from('ratings')
      .where({ resource_type: type, tag })
      .orderByRaw('RANDOM()')
      .first();
    return rating;
  };
}
