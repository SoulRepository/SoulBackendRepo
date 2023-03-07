import { Controller, Get, Param } from '@nestjs/common';
import { SbtService } from './sbt.service';
import { CompaniesService } from 'companies/companies.service';

@Controller('sbt')
export class SbtController {
  constructor(
    private readonly sbtService: SbtService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Get('digi-proofs')
  getDigiProofs() {
    return this.sbtService.getDigiProofs();
  }

  @Get('metadata/:souldId/:filter')
  async getMetadata(
    @Param('companyId') soulId: string,
    @Param('filter') filter: string,
  ) {
    const company = await this.companiesService.findOne({ soulId });
    return this.sbtService.enrichCompanyWithMetadata(company, filter);
  }
}
