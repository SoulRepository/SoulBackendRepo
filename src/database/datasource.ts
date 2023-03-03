import { resolve, join } from 'node:path';

import * as pg from 'pg';
import { parse } from 'pg-connection-string';

import { ConfigService } from '@common/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigSchema } from '../config/config.schema';
import * as process from 'process';

const configService = new ConfigService<ConfigSchema>(ConfigSchema);
const parsedUrl = parse(configService.get('DATABASE_URL'));

pg.defaults.parseInputDatesAsUTC = true;

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  // logger: 'advanced-console',
  // logging: true,
  synchronize: false,
  entities: [
    resolve(__dirname, './../**/*.entity{.ts,.js}'),
    // resolve(__dirname, './../**/*.entity{.ts,.js}'),
  ],
  migrations: [resolve(__dirname, './migrations/**/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  ssl: Boolean(parsedUrl.ssl),
};

export const AppDataSource = new DataSource(dbConfig);
