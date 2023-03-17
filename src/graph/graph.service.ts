import { Injectable, OnModuleInit } from '@nestjs/common';
import got, { Got } from 'got';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import fs from 'node:fs/promises';
import path from 'path';
import {
  GraphqlResponse,
  DigiProofResponse,
  MetadataResult,
  MetadataSingleResult,
} from './intefaces';
import { GraphError } from './errors/graph.error';
import { FindManyFilterInterface } from './intefaces';

@Injectable()
export class GraphService implements OnModuleInit {
  private readonly client: Got;
  private readonly queries = new Map<string, string>();

  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    this.client = got.extend({
      url: this.configService.get('SUBGRAPH_URL'),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.registerQuery('get-digi-proofs');
    await this.registerQuery('get-metadata-by-address');
    await this.registerQuery('get-metadata');
  }

  async getCompanies(filter?: FindManyFilterInterface) {
    const { data } = await this.sendQuery<MetadataResult>(
      'get-metadata-by-address',
      {
        filter: {
          ...(filter?.withCompanyAddress && {
            companies_: { address: filter.withCompanyAddress },
          }),
          ...(filter?.digiProofType && {
            digiProofType_: { id: filter.digiProofType },
          }),
        },
        limit: filter?.limit ?? 100,
      },
    );

    return data;
  }

  async getCompany(sbtId: string) {
    const { data } = await this.sendQuery<MetadataSingleResult>(
      'get-metadata',
      {
        id: sbtId,
      },
    );

    return data;
  }

  async getDigiProofs() {
    const { data } = await this.sendQuery<DigiProofResponse>('get-digi-proofs');
    return data;
  }

  private async registerQuery(name: string) {
    const query = await fs.readFile(
      path.join(process.cwd(), 'src/graph/queries', `${name}.query.graphql`),
      { encoding: 'utf-8' },
    );
    this.queries.set(name, query);
  }

  private async sendQuery<R, V = unknown>(name: string, variables?: V) {
    if (!this.queries.has(name)) {
      throw new Error('Not registered query');
    }
    const query = this.queries.get(name);
    const result = await this.client
      .post({
        json: {
          query,
          variables,
        },
      })
      .json<GraphqlResponse<R>>();

    if (result.errors) {
      throw new GraphError(result.errors);
    }

    return result;
  }
}
