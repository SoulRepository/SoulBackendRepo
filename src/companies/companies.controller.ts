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

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async getCompanies(@Query() query: SearchCompanyDto) {
    const companies = await this.companiesService.findManyByQuery(query.query);

    return Promise.all(
      companies.map((c) => this.companiesService.resolveCompanyImages(c)),
    );
  }

  @Post()
  async createCompany(@Body() data: CreateCompanyDto): Promise<Company> {
    const createdCompany = await this.companiesService.createOne(data);
    return this.companiesService.resolveCompanyImages(createdCompany);
  }

  @Get('/:soulId')
  async getCompany(@Param('soulId') soulId: string) {
    const company = await this.companiesService.findOne({ soulId });
    return this.companiesService.resolveCompanyImages(company);
  }

  @Patch('/:soulId')
  async updateCompany(
    @Param('soulId') soulId: string,
    @Body() data: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.companiesService.updateOne({ soulId }, data);

    return this.companiesService.resolveCompanyImages(company);
  }

  @Post('/:soulId/image-credentials')
  getImageCredentials(
    @Param('soulId') soulId: string,
    @Body() data: GenerateImageCredentialsDto,
  ): Promise<ImageCredentialsResponse> {
    return this.companiesService.generateImageCredentials({ soulId }, data);
  }
}
