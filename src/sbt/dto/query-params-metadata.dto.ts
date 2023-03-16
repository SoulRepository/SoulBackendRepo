import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryParamsMetadataDto {
  @IsString()
  @IsOptional()
  digiProof?: string;

  @IsString()
  souldId: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}
