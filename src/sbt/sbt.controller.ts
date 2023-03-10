import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { SbtService } from './sbt.service';
import { CompaniesService } from 'companies/companies.service';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamsMetadataDto } from './dto/query-params-metadata.dto';
import { QueryParamsMetadataOneDto } from './dto/query-params-metadata-one.dto';

@ApiTags('SBT')
@Controller('sbt')
export class SbtController {
  constructor(
    private readonly sbtService: SbtService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Get()
  async getSbtList(@Query() query: QueryParamsMetadataDto) {
    const company = await this.companiesService.findOne({
      soulId: query.souldId,
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.sbtService.findMany(company, query.digiProof);
  }

  @Get('/:sbtId')
  async getSbt(
    @Query() query: QueryParamsMetadataOneDto,
    @Param('sbtId') sbtId: string,
  ) {
    const company = await this.companiesService.findOne({
      soulId: query.souldId,
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.sbtService.findOne(sbtId, company);
  }
}
