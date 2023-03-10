import { IsString } from 'class-validator';

export class QueryParamsMetadataOneDto {
  @IsString()
  souldId: string;
}
