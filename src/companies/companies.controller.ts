import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
  Request,
} from '@nestjs/common';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { CompaniesService } from 'companies/companies.service';
import { GenerateImageCredentialsDto } from 'companies/dto/generate-image-credentials.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchCompanyDto } from 'companies/dto/search-company.dto';
import { ImageCredentialsResponse } from 'companies/dto/image-credentials.response';
import { Company } from 'entities';
import { UpdateCompanyDto } from 'companies/dto/update-company.dto';
import { OnlyForAdmin } from '../auth/decorators';
import { VerifySign } from '../auth/decorators/verify-sign.decorator';
import { HttpRequest } from 'common/interfaces';
import { AuthHeadersDto } from '../auth/dto';

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
    if (req.address) {
      const companyToCheckAddress = await this.companiesService.findOne({
        soulId,
      });
      if (companyToCheckAddress.address !== req.address) {
        throw new ForbiddenException(
          'You not allowed to update not yours company',
        );
      }
    }
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
