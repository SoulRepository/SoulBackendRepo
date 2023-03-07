import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { DigiProofResult } from './interfaces/digi-proof.result';
import { Company } from 'entities';
import { MetadataResult } from './interfaces/metadata.result';
import { CompaniesService } from 'companies/companies.service';
import { CompanyWithMetadataResponse } from './dto/company-with-metadata.response';
import { ImagesService } from 'images/images.service';

@Injectable()
export class SbtService {
  constructor(
    private readonly graphService: GraphService,
    private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService,
  ) {}

  async getDigiProofs() {
    const { data } = await this.graphService.sendQuery<DigiProofResult>(
      'get-digi-proofs',
    );
    return data.digiProofTypes.map((d) => ({
      name: d.id,
    }));
  }

  async enrichCompanyWithMetadata(
    company: Company,
    digiProofTypeFilter: string,
  ): Promise<CompanyWithMetadataResponse> {
    const { data } = await this.graphService.sendQuery<MetadataResult>(
      'get-metadata-by-address',
      {
        address: company.address,
      },
    );

    const subPromises = data.metadataObjects
      .filter((t) => t.digiProofType.id === digiProofTypeFilter)
      .map((p) =>
        p.companies.filter(
          (s) => s.address.toLowerCase() !== company.address.toLowerCase(),
        ),
      )
      .flat()
      .map(async (p) => {
        const subCompany = await this.companiesService.findOne({
          address: p.address,
        });
        if (!subCompany) {
          return {
            name: 'Undefined',
            featuredImage: undefined,
            logo: undefined,
            soulId: 'undefined.soul',
            address: p.address,
          };
        }
        return {
          name: subCompany.name,
          featuredImage: await this.imagesService.getImageUrl(
            subCompany.featuredImage,
          ),
          logo: await this.imagesService.getImageUrl(subCompany.logoImage),
          soulId: subCompany.soulId,
          address: p.address,
        };
      });

    return {
      hostCompany: {
        name: company.name,
        logo: await this.imagesService.getImageUrl(company.logoImage),
        soulId: company.soulId,
      },
      sbt: {
        digiProofType: digiProofTypeFilter,
      },
      subCompanies: await Promise.all(subPromises),
    };
  }
}
