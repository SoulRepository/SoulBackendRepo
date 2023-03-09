import { IsBoolean, IsOptional } from 'class-validator';

export class GenerateImageCredentialsDto {
  @IsBoolean()
  @IsOptional()
  forBackground: boolean;

  @IsBoolean()
  @IsOptional()
  forFeatured: boolean;

  @IsBoolean()
  @IsOptional()
  forLogo: boolean;
}
