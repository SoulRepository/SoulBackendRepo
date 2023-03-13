import {
  IsArray,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLinkDto } from 'companies/dto/create-update-link.dto';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(32)
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @IsString()
  soulId: string;

  // @IsString()
  // @IsOptional()
  // backgroundImageKey?: string;
  //
  // @IsString()
  // @IsOptional()
  // logoImageKey?: string;
  //
  // @IsString()
  // @IsOptional()
  // featuredImageKey?: string;

  @IsNumber({}, { each: true })
  categoriesIds: number[];

  @IsEthereumAddress()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links: CreateLinkDto[];
}
