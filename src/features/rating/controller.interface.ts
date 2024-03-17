import { IRating, TRatingType } from './model';

export interface IRatingController {
  addRating(url: string, type: TRatingType, tag: string): Promise<number[]>;
  getRatingById(id: number): Promise<IRating>;
  getRatingByUrl(url: string): Promise<IRating>;
  getTop(count: number): Promise<IRating[]>;
  getLiked(): Promise<IRating>;
  getRandom(type: TRatingType, tag: string): Promise<IRating>;
  setLikesById(id: number, likesCount: number): Promise<void>;
  setDislikesById(id: number, dislikesCount: number): Promise<void>;
  setShowsById(id: number, showCount: number): Promise<void>;
}
