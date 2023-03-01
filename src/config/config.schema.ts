import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigSchema {
  @IsNumber()
  @Type(() => Number)
  PORT = 3355;

  @IsString()
  HOST = '127.0.0.1';

  @IsString()
  SERVICE_NAME = 'soul-search-api';

  @IsString()
  @IsOptional()
  NODE_ENV?: string;

  @IsIn(['stage', 'production'])
  ENV = 'stage';

  @IsString()
  DATABASE_URL: string;
}
