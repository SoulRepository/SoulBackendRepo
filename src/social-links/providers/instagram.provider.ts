import { Injectable } from '@nestjs/common';
import got from 'got';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../../config/config.schema';
import qs from 'node:querystring';
import { InstagramAccessTokenResponse } from './interfaces/instagram-access-token.response';
import { BaseProvider } from './base.provider';
import { InstagramLongLivedResponse } from './interfaces/instagram-long-lived.response';
import { InstagramProfileResponse } from './interfaces/instagram-profile.response';
import { TokenRetrieveResult } from './dto/token-retrieve.result';
import { UserProfileInterface } from './interfaces/user-profile.interface';

@Injectable()
export class InstagramProvider implements BaseProvider {
  private readonly redirectUrl;

  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    this.redirectUrl = `${this.configService.get(
      'BASE_URL',
    )}/api/social-links/instagram/callback`;
  }

  getAuthLink(): string {
    const query = {
      response_type: 'code',
      redirect_uri: this.redirectUrl,
      scope: 'user_profile',
      client_id: this.configService.get<string>('INSTAGRAM_CLIENT_ID'),
    };
    return 'https://api.instagram.com/oauth/authorize?' + qs.stringify(query);
  }

  async processCode(code: string): Promise<TokenRetrieveResult> {
    const { access_token } = await got
      .post('https://api.instagram.com/oauth/access_token', {
        form: {
          client_id: this.configService.get('INSTAGRAM_CLIENT_ID'),
          client_secret: this.configService.get('INSTAGRAM_CLIENT_SECRET'),
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUrl,
        },
      })
      .json<InstagramAccessTokenResponse>();

    const longLivedToken = await this.getLongToken(access_token);

    const validUntil = new Date(Date.now() + longLivedToken.expires_in * 1000);

    return {
      accessToken: longLivedToken.access_token,
      refreshToken: null,
      validUntil,
    };
  }

  getLongToken(accessToken: string): Promise<InstagramLongLivedResponse> {
    return got
      .get('https://graph.instagram.com/access_token', {
        searchParams: {
          grant_type: 'ig_exchange_token',
          client_secret: this.configService.get('INSTAGRAM_CLIENT_SECRET'),
          access_token: accessToken,
        },
      })
      .json<InstagramLongLivedResponse>();
  }

  async refreshToken(old: TokenRetrieveResult): Promise<TokenRetrieveResult> {
    const { expires_in: expireIn, access_token: accessToken } = await got
      .get('https://graph.instagram.com/refresh_access_token', {
        searchParams: {
          grant_type: 'ig_refresh_token',
          access_token: old.accessToken,
        },
      })
      .json<InstagramLongLivedResponse>();

    const validUntil = new Date(Date.now() + expireIn * 1000);

    return {
      accessToken,
      validUntil,
    };
  }

  async getUser(accessToken: string): Promise<UserProfileInterface> {
    const data = await got
      .get('https://graph.instagram.com/v16.0/me', {
        searchParams: {
          fields: 'username,account_type',
          access_token: accessToken,
        },
      })
      .json<InstagramProfileResponse>();

    return {
      id: data.id,
      username: data.username,
      email: null,
    };
  }

  async getProfileLink(accessToken: string): Promise<string> {
    const user = await this.getUser(accessToken);
    return `https://instagram.com/${user.username}`;
  }
}
