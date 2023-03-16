import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigSchema {
  @IsNumber()
  @Type(() => Number)
  PORT = 4300;

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

  @IsString()
  BASE_URL: string;

  @IsString()
  @IsOptional()
  IMAGES_S3_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  IMAGES_S3_SECRET_KEY?: string;

  @IsString()
  @IsOptional()
  IMAGES_S3_ENDPOINT?: string;

  @IsString()
  IMAGES_S3_REGION = 'us-east-1';

  @IsString()
  @IsOptional()
  IMAGES_S3_CDN?: string;

  @IsString()
  IMAGES_S3_BUCKET: string;

  @IsNumber()
  @Type(() => Number)
  IMAGES_S3_LIMIT = 5000000;

  @IsString()
  SUBGRAPH_URL: string;

  @IsNumber()
  @Type(() => Number)
  PASSWORD_SALT_ROUNDS = 10;

  @IsString()
  DEFAULT_ADMIN_PASSWORD = 'admin123';

  @IsString()
  JWT_SECRET = 'secret';

  @IsNumber()
  @Type(() => Number)
  JWT_EXPIRE_SECONDS = 60 * 60 * 24 * 30;

  @IsString()
  INSTAGRAM_CLIENT_ID: string;

  @IsString()
  INSTAGRAM_CLIENT_SECRET: string;

  @IsString()
  DISCORD_CLIENT_ID: string;

  @IsString()
  DISCORD_CLIENT_SECRET: string;
}
