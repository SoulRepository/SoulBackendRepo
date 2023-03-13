import { Expose } from 'class-transformer';

export class AuthHeadersDto {
  @Expose()
  'x-web3-sign'?: string;
  @Expose()
  'x-web3-message'?: string;
  @Expose()
  'x-web3-address'?: string;
}
