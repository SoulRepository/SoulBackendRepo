import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamsMetadataDto {
  @IsString()
  @IsOptional()
  digiProof?: string;

  @IsString()
  souldId: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}
