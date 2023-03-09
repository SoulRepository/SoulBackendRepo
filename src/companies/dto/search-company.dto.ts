import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCompanyDto {
  @ApiProperty({ description: 'Field for search by address or souldId' })
  @IsString()
  @MinLength(3)
  @MaxLength(42)
  query: string;
}
