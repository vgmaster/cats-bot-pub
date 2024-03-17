import { Context } from 'telegraf';

export interface ISessionData {
  likeId: number;
}

export interface IBotContext extends Context {
  session: ISessionData;
}
