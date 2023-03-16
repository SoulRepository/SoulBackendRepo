import { Module } from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { SocialLinksController } from './social-links.controller';
import { InstagramProvider } from './providers/instagram.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyLink } from 'entities';
import { CompaniesModule } from 'companies/companies.module';
import { DiscordProvider } from './providers/discord.provider';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyLink]), CompaniesModule],
  providers: [SocialLinksService, InstagramProvider, DiscordProvider],
  controllers: [SocialLinksController],
})
export class SocialLinksModule {}
