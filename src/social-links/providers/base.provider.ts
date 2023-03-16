import { TokenRetrieveResult } from './dto/token-retrieve.result';
import { UserProfileInterface } from './interfaces/user-profile.interface';

export interface BaseProvider {
  getAuthLink(): string | Promise<string>;
  processCode(code: string): TokenRetrieveResult | Promise<TokenRetrieveResult>;
  refreshToken(
    old: TokenRetrieveResult,
  ): TokenRetrieveResult | Promise<TokenRetrieveResult>;

  getUser(
    accessToken: string,
  ): UserProfileInterface | Promise<UserProfileInterface>;

  getProfileLink(accessToken: string): string | Promise<string>;
}
