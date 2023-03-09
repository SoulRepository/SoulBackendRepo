import { Injectable, OnModuleInit } from '@nestjs/common';
import got, { Got } from 'got';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import fs from 'node:fs/promises';
import path from 'path';
import { GraphqlResponse } from './intefaces/graphql.response';

@Injectable()
export class GraphService implements OnModuleInit {
  private readonly client: Got;
  private readonly queries = new Map<string, string>();

  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    this.client = got.extend({
      url: this.configService.get('SUBGRAPH_URL'),
    });
  }

  async registerQuery(name: string) {
    const query = await fs.readFile(
      path.join(process.cwd(), 'src/graph/queries', `${name}.query.graphql`),
      { encoding: 'utf-8' },
    );
    this.queries.set(name, query);
  }

  async sendQuery<R, V = unknown>(name: string, variables?: V) {
    if (!this.queries.has(name)) {
      throw new Error('Not registered query');
    }
    const query = this.queries.get(name);
    return this.client
      .post({
        json: {
          query,
          variables,
        },
      })
      .json<GraphqlResponse<R>>();
  }

  async onModuleInit(): Promise<void> {
    await this.registerQuery('get-digi-proofs');
    await this.registerQuery('get-metadata-by-address');
    await this.registerQuery('get-metadata');
    // this.sendQuery('get-metadata-by-address', {
    //   address: '0x8f82ca16d4f47bcd1d24c9c93ce2b4e6f8390991',
    // });
  }
}
