import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { DigiProofResult } from '../digi-proofs/interfaces/digi-proof.result';
import { Company } from 'entities';
import {
  MetadataCompanyResult,
  MetadataObject,
  MetadataResult,
  MetadataSingleResult,
} from './interfaces/metadata.result';
import { CompaniesService } from 'companies/companies.service';
import { ImagesService } from 'images/images.service';
import { DigiProofListResponse } from '../digi-proofs/dto/digi-proof-list.response';
import {
  SbtItemCompanyResponse,
  SbtItemResponse,
} from './dto/sbt-item.response';

@Injectable()
export class SbtService {
  constructor(
    private readonly graphService: GraphService,
    private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService,
  ) {}

  async getDigiProofs(): Promise<DigiProofListResponse[]> {
    const { data } = await this.graphService.sendQuery<DigiProofResult>(
      'get-digi-proofs',
    );
    return data.digiProofTypes.map((d) => ({
      name: d.id,
    }));
  }

  async findMany(
    company: Company,
    digiProofTypeFilter?: string,
  ): Promise<SbtItemResponse[]> {
    const { data } = await this.graphService.sendQuery<MetadataResult>(
      'get-metadata-by-address',
      {
        filter: {
          companies_: { address: company.address },
          ...(digiProofTypeFilter && {
            digiProofType_: { id: digiProofTypeFilter },
          }),
        },
      },
    );

    const sbtList = data.metadataObjects.map(async (sbt) =>
      this.mapSbt(company, sbt),
    );

    return Promise.all(sbtList);
  }

  async findOne(sbtId: string, company: Company): Promise<SbtItemResponse> {
    const { data } = await this.graphService.sendQuery<MetadataSingleResult>(
      'get-metadata',
      {
        id: sbtId,
      },
    );
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
        name: 'Undefined',
        featuredImage: null,
        logo: null,
        soulId: 'undefined.soul',
        address: metadataCompany.address,
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
    };
  }
}
