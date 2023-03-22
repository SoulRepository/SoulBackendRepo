import { IsString } from 'class-validator';

export class AuthData {
  @IsString()
  endpoint: string;
  @IsString()
  token: string;
}
