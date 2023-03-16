import {
  IsArray,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLinkDto } from 'companies/dto/create-update-link.dto';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @IsString()
  @IsOptional()
  soulId?: string;

  @IsString()
  @IsOptional()
  backgroundImageKey?: string;

  @IsString()
  @IsOptional()
  logoImageKey?: string;

  @IsString()
  @IsOptional()
  featuredImageKey?: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  categoriesIds?: number[];

  @IsEthereumAddress()
  @IsOptional()
  address?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  @IsOptional()
  links?: CreateLinkDto[];
}
