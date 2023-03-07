import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { CompaniesService } from 'companies/companies.service';
import { GenerateImageCredentialsDto } from 'companies/dto/generate-image-credentials.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchCompanyDto } from 'companies/dto/search-company.dto';
import { ImageCredentialsResponse } from 'companies/dto/image-credentials.response';
import { Company } from 'entities';
import { UpdateCompanyDto } from 'companies/dto/update-company.dto';
import { SingleCompanyResponse } from 'companies/dto/single-company.response';
import { ImagesService } from 'images/images.service';

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get()
  getCompanies(@Query() query: SearchCompanyDto): Promise<Company[]> {
    return this.companiesService.findManyByQuery(query.query);
  }

  @Post()
  createCompany(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companiesService.createOne(data);
  }

  @Get('/:soulId')
  async getCompany(@Param('soulId') soulId: string) {
    const company = await this.companiesService.findOne({ soulId });
    return this.mapCompanyForSingle(company);
  }

  @Patch('/:soulId')
  updateCompany(
    @Param('soulId') soulId: string,
    @Body() data: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.updateOne({ soulId }, data);
  }

  @Post('/:soulId/image-credentials')
  getImageCredentials(
    @Param('soulId') soulId: string,
    @Body() data: GenerateImageCredentialsDto,
  ): Promise<ImageCredentialsResponse> {
    return this.companiesService.generateImageCredentials({ soulId }, data);
  }

  private async mapCompanyForSingle(
    company: Company,
  ): Promise<SingleCompanyResponse> {
    return {
      name: company.name,
      description: company.description,
      soulId: company.soulId,
      links: company?.links?.map((l) => ({ type: l.type, url: l.url })),
      joinDate: company.createdAt,
      backgroundImage: await this.imagesService.getImageUrl(
        company.backgroundImage,
      ),
      logoImage: await this.imagesService.getImageUrl(company.logoImage),
      categories: company?.categories?.map((c) => ({ id: c.id, name: c.name })),
      address: company.address,
    };
  }
}
