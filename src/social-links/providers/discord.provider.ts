import { Injectable } from '@nestjs/common';
import { BaseProvider } from './base.provider';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../../config/config.schema';
import qs from 'node:querystring';
import { UserProfileInterface } from './interfaces/user-profile.interface';
import { TokenRetrieveResult } from './dto/token-retrieve.result';
import got from 'got';
import { DiscordAccessTokenResponse } from './interfaces/discord-access-token.response';
import { DiscordProfileResponse } from './interfaces/discord-profile.response';

@Injectable()
export class DiscordProvider implements BaseProvider {
  private readonly redirectUrl;
  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    this.redirectUrl = this.configService.get('FRONTEND_REDIRECT_URL');
  }
  getAuthLink(): string | Promise<string> {
    const query = {
      response_type: 'code',
      client_id: this.configService.get<string>('DISCORD_CLIENT_ID'),
      scope: 'identify',
      redirect_uri: this.redirectUrl,
      prompt: 'consent',
      state: '_discord',
    };
    return `https://discord.com/oauth2/authorize?${qs.stringify(query)}`;
  }

  async getProfileLink(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);
    return `https://discordapp.com/users/${user.id}`;
  }

  async getUser(accessToken: string): Promise<UserProfileInterface> {
    const { user } = await got
      .get('https://discord.com/api/v10/oauth2/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .json<DiscordProfileResponse>();
    return {
      id: user.id,
      username: user.username,
      email: null,
    };
  }

  async processCode(code: string): Promise<TokenRetrieveResult> {
    const result = await got
      .post('https://discord.com/api/v10/oauth2/token', {
        form: {
          client_id: this.configService.get('DISCORD_CLIENT_ID'),
          client_secret: this.configService.get('DISCORD_CLIENT_SECRET'),
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUrl,
        },
      })
      .json<DiscordAccessTokenResponse>();

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      validUntil: new Date(Date.now() + result.expires_in * 1000),
    };
  }

  async refreshToken(old: TokenRetrieveResult): Promise<TokenRetrieveResult> {
    const result = await got
      .post('https://discord.com/api/v10/oauth2/token', {
        form: {
          client_id: this.configService.get('DISCORD_CLIENT_ID'),
          client_secret: this.configService.get('DISCORD_CLIENT_SECRET'),
          grant_type: 'refresh_token',
          refresh_token: old.refreshToken,
        },
      })
      .json<DiscordAccessTokenResponse>();

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      validUntil: new Date(Date.now() + result.expires_in * 1000),
    };
  }
}
