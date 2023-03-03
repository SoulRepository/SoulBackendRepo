import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  getCompanies(@Query() query: SearchCompanyDto): Promise<Company[]> {
    return this.companiesService.findManyByQuery(query.query);
  }

  @Post()
  createCompany(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companiesService.createOne(data);
  }

  @Get('/:soulId')
  getCompany(@Param('soulId') soulId: string): Promise<Company> {
    return this.companiesService.findOne({ soulId });
  }

  @Put('/:soulId')
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
}
