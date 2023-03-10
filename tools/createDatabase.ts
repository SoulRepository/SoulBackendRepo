import 'dotenv/config';

import { Client } from 'pg';
import { parse } from 'pg-connection-string';
import * as process from 'process';

export async function createDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('No DATABASE_URL env provided');
  }

  const parsedUrl = parse(process.env.DATABASE_URL);

  const client = new Client({
    host: parsedUrl.host,
    port: parsedUrl.port ? Number(parsedUrl.port) : 5432,
    user: parsedUrl.user,
    password: parsedUrl.password,
    database: 'postgres',
    ssl: Boolean(parsedUrl.ssl),
  });

  await client.connect();

  const databaseName = parsedUrl.database || 'blaize_keeper';

  const { rowCount: exists } = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [databaseName],
  );

  if (!exists) {
    console.log('database not exist, creating');
    await client.query(`CREATE DATABASE ${databaseName}`);
  }
  console.log('finish');
  await client.end();
}

createDatabase().catch((e) => {
  console.error(e);
});
