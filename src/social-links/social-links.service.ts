import { Injectable, NotFoundException } from '@nestjs/common';
import { InstagramProvider } from './providers/instagram.provider';
import { BaseProvider } from './providers/base.provider';
import { Company, CompanyLink, LinkType } from 'entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordProvider } from './providers/discord.provider';

/* TODO
 - Add auto refresh token
 - Add logic for delete data
 */
@Injectable()
export class SocialLinksService {
  private readonly providers = new Map<string, BaseProvider>();
  constructor(
    @InjectRepository(CompanyLink)
    private readonly companyLinkRepository: Repository<CompanyLink>,
    private readonly instagramProvider: InstagramProvider,
    private readonly discordProvider: DiscordProvider,
  ) {
    this.providers.set(LinkType.INSTAGRAM, this.instagramProvider);
    this.providers.set(LinkType.DISCORD, this.discordProvider);
  }
  getAuthLink(type: LinkType) {
    if (!this.providers.has(type)) {
      throw new NotFoundException(
        `Social link type verify ${type} not supported`,
      );
    }

    return this.providers.get(type).getAuthLink();
  }

  async processCode(type: LinkType, code: string, company: Company) {
    if (!this.providers.has(type)) {
      throw new NotFoundException(
        `Social link type verify ${type} not supported`,
      );
    }

    const provider = this.providers.get(type);
    const authData = await provider.processCode(code);
    const link = await provider.getProfileLink(authData.accessToken);

    const linkEntity = this.companyLinkRepository.create({
      company: {
        id: company.id,
      },
      type,
      url: link,
      verified: true,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      validUntil: authData.validUntil,
    });
    await this.companyLinkRepository.upsert(linkEntity, ['company', 'type']);
    return this.companyLinkRepository.findOne({
      where: {
        company: {
          id: company.id,
        },
        type,
      },
    });
  }
}
