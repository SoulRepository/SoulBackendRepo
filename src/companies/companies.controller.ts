import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { CompaniesService } from 'companies/companies.service';
import { GenerateImageCredentialsDto } from 'companies/dto/generate-image-credentials.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchCompanyDto } from 'companies/dto/search-company.dto';
import { ImageCredentialsResponse } from 'companies/dto/image-credentials.response';
import { Company } from 'entities';
import { UpdateCompanyDto } from 'companies/dto/update-company.dto';
import { OnlyForAdmin } from 'auth/decorators';
import { VerifySign } from 'auth/decorators/verify-sign.decorator';
import { HttpRequest } from 'common/interfaces';
import { AuthHeadersDto } from 'auth/dto';
import { NonceResponse } from 'companies/dto/nonce.response';

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
  @OnlyForAdmin()
  @ApiBearerAuth()
  async createCompany(@Body() data: CreateCompanyDto): Promise<Company> {
    // const createdCompany = await this.companiesService.createOne(data);
    // return this.companiesService.resolveCompanyImages(createdCompany);
    return this.companiesService.createOne(data);
  }

  @Get('/:soulId')
  async getCompany(@Param('soulId') soulId: string) {
    const company = await this.companiesService.findOne({ soulId });
    if (!company) {
      throw new NotFoundException(`Company ${soulId} not found`);
    }
    return this.companiesService.resolveCompanyImages(company);
  }

  @Patch('/:soulId')
  @VerifySign()
  @OnlyForAdmin()
  @ApiBearerAuth()
  async updateCompany(
    @Param('soulId') soulId: string,
    @Headers() authHeaders: AuthHeadersDto,
    @Body() data: UpdateCompanyDto,
    @Request() req: HttpRequest,
  ): Promise<Company> {
    await this.companiesService.ensureAddressRelatedToCompany(req, soulId);
    const company = await this.companiesService.updateOne({ soulId }, data);
    return this.companiesService.resolveCompanyImages(company);
  }

  @Post('/:soulId/image-credentials')
  @VerifySign()
  @OnlyForAdmin()
  @ApiBearerAuth()
  async getImageCredentials(
    @Param('soulId') soulId: string,
    @Body() data: GenerateImageCredentialsDto,
    @Headers() authHeaders: AuthHeadersDto,
    @Request() req: HttpRequest,
  ): Promise<ImageCredentialsResponse> {
    await this.companiesService.ensureAddressRelatedToCompany(req, soulId);
    return this.companiesService.generateImageCredentials({ soulId }, data);
  }

  @Post('/:soulId/nonce')
  getNonce(@Param('soulId') soulId: string): Promise<NonceResponse> {
    return this.companiesService.retrieveCompanyNonce({ soulId });
  }
}
