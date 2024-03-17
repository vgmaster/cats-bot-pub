import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import knex from 'knex';
import { TYPES } from '@app/types';
import { IConfigService } from '@app/services';
import { IDatabaseService } from './database.interface';

@injectable()
export class DatabaseService implements IDatabaseService {
  private knex;

  constructor(
    @inject(TYPES.IConfigService) private readonly configService: IConfigService
  ) {
    const config = {
      client: 'postgresql',
      connection: {
        host: this.configService.get('POSTGRES_HOST'),
        database: this.configService.get('POSTGRES_DB'),
        port: this.configService.get('POSTGRES_PORT'),
        user: this.configService.get('POSTGRES_USER'),
        password: this.configService.get('POSTGRES_PASSWORD'),
        
      },
      pool: {
        min: 2,
        max: 10
      },
      useNullAsDefault: true,
    };

    const knexInstance = knex(config);
    this.knex = knexInstance;
  }

  public get() {
    return this.knex;
  }
}
