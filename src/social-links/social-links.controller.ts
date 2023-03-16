import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { GetSocialAuthLinkResponse } from './dto/get-social-auth-link.response';
import { GetSocialLinkParamsDto } from './dto/get-social-link-params.dto';
import { ProcessCodeBodyDto } from './dto/process-code-body.dto';
import { ApiTags } from '@nestjs/swagger';
import { CompaniesService } from 'companies/companies.service';

@Controller('social-links')
@ApiTags('Social Links')
export class SocialLinksController {
  constructor(
    private readonly socialLinksService: SocialLinksService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Get('/:type')
  async getSocialLink(
    @Param() params: GetSocialLinkParamsDto,
  ): Promise<GetSocialAuthLinkResponse> {
    const link = await this.socialLinksService.getAuthLink(params.type);

    return { link };
  }

  @Post()
  async processSocialLinkCode(@Body() data: ProcessCodeBodyDto) {
    const company = await this.companiesService.findOne({
      soulId: data.soulId,
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.socialLinksService.processCode(data.type, data.code, company);
  }
}
