import { Controller, Get, Param } from '@nestjs/common';
import { SbtService } from './sbt.service';
import { CompaniesService } from 'companies/companies.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SBT')
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

  @Get('metadata/:souldId/:digiProof')
  async getMetadata(
    @Param('souldId') soulId: string,
    @Param('digiProof') digiProof: string,
  ) {
    const company = await this.companiesService.findOne({ soulId });
    return this.sbtService.enrichCompanyWithMetadata(company, digiProof);
  }
}
