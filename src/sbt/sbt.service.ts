import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { Company } from 'entities';
import { MetadataCompanyResult, MetadataObject } from '../graph/intefaces';
import { CompaniesService } from 'companies/companies.service';
import { ImagesService } from 'images/images.service';
import {
  SbtItemCompanyResponse,
  SbtItemResponse,
} from './dto/sbt-item.response';
import { FindManyFilterInterface } from '../graph/intefaces';

@Injectable()
export class SbtService {
  constructor(
    private readonly graphService: GraphService,
    private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService,
  ) {}

  async findMany(
    company: Company,
    filter: FindManyFilterInterface,
  ): Promise<SbtItemResponse[]> {
    const data = await this.graphService.getCompanies(filter);

    const sbtList = data.metadataObjects.map(async (sbt) =>
      this.mapSbt(company, sbt),
    );

    return Promise.all(sbtList);
  }

  async findOne(sbtId: string, company: Company): Promise<SbtItemResponse> {
    const data = await this.graphService.getCompany(sbtId);
    return this.mapSbt(company, data.metadataObject);
  }

  private async mapSbt(
    company: Company,
    metadata: MetadataObject,
  ): Promise<SbtItemResponse> {
    const sbtCompanies = metadata.companies.filter(
      (c) => c.address.toLowerCase() !== company.address.toLowerCase(),
    );
    const companies = await Promise.all(
      sbtCompanies.map((c) => this.getSbtCompany(c)),
    );
    return {
      sbtId: metadata.id,
      digiProofType: metadata.digiProofType.id,
      description: metadata.description,
      uri: metadata.uri,
      createdAt: new Date(Number(metadata.createdBlockTimestamp) * 1000),
      companies,
    };
  }

  private async getSbtCompany(
    metadataCompany: MetadataCompanyResult,
  ): Promise<SbtItemCompanyResponse> {
    const subCompany = await this.companiesService.findOne({
      address: metadataCompany.address,
    });

    if (!subCompany) {
      return {
        name: metadataCompany.name,
        featuredImage: null,
        logo: null,
        soulId: 'undefined.soul',
        address: metadataCompany.address,
        verified: false,
        synced: false,
      };
    }

    return {
      name: subCompany.name,
      featuredImage:
        (await this.imagesService.getImageUrl(subCompany.featuredImage)) ??
        null,
      logo:
        (await this.imagesService.getImageUrl(subCompany.logoImage)) ?? null,
      soulId: subCompany.soulId,
      address: metadataCompany.address,
      verified: subCompany.links.some((l) => l.verified),
      synced: true,
    };
  }
}
