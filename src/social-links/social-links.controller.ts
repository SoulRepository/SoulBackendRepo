import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { GetSocialAuthLinkResponse } from './dto/get-social-auth-link.response';
import { GetSocialLinkParamsDto } from './dto/get-social-link-params.dto';
import { ProcessCodeBodyDto } from './dto/process-code-body.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from 'companies/companies.service';
import { VerifySign } from 'auth/decorators/verify-sign.decorator';
import { OnlyForAdmin } from 'auth/decorators';
import { AuthHeadersDto } from 'auth/dto';
import { HttpRequest } from 'common/interfaces';

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
  @VerifySign()
  @OnlyForAdmin()
  @ApiBearerAuth()
  async processSocialLinkCode(
    @Body() data: ProcessCodeBodyDto,
    @Headers() authHeaders: AuthHeadersDto,
    @Request() req: HttpRequest,
  ) {
    await this.companiesService.ensureAddressRelatedToCompany(req, data.soulId);
    const company = await this.companiesService.findOne({
      soulId: data.soulId,
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.socialLinksService.processCode(data.type, data.code, company);
  }
}
