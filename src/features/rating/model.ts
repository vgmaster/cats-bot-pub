export type TRatingType = 'image' | 'video';

export interface IRating {
  id: number;
  url: string;
  resource_type: TRatingType;
  tag: string;
  likes: number;
  dislikes: number;
  shows: number;
  is_visible: boolean;
  raw_tags: string;
}
