import { IsOptional, IsString } from 'class-validator';

export class QueryParamsMetadataDto {
  @IsString()
  @IsOptional()
  digiProof?: string;

  @IsString()
  souldId: string;
}
