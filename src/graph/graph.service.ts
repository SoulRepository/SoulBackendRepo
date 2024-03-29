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
} from './intefaces';
import { GraphError } from './errors/graph.error';
import { FindManyFilterInterface } from './intefaces';
import { CompaniesResponse } from 'graph/intefaces/companiesResponse';
import { SbtCompanyFilter } from 'graph/intefaces/sbt-company-filter.interface';

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
    await this.registerQuery('get-metadata-objects');
    await this.registerQuery('get-metadata-companies');
  }

  async getSbtMetadata(filter?: FindManyFilterInterface) {
    const { data } = await this.sendQuery<MetadataResult>(
      'get-metadata-objects',
      {
        filter: {
          ...(filter?.withCompanyAddress && {
            companies_: { address: filter.withCompanyAddress },
          }),
          ...(filter?.digiProofType && {
            digiProofType_: { id: filter.digiProofType },
          }),
          ...(filter?.sbtId && {
            id: filter.sbtId,
          }),
        },
        limit: filter?.limit ?? 100,
      },
    );

    return data;
  }

  async getDigiProofs() {
    const { data } = await this.sendQuery<DigiProofResponse>('get-digi-proofs');
    return data;
  }

  async getSbtCompanies(filter: SbtCompanyFilter) {
    const { data } = await this.sendQuery<CompaniesResponse>(
      'get-metadata-companies',
      {
        filter: {
          ...(filter.address && { address: filter.address }),
        },
      },
    );

    return data?.companies;
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
