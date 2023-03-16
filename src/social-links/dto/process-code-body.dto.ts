import { LinkType } from 'entities';
import { IsEnum, IsString } from 'class-validator';

export class ProcessCodeBodyDto {
  @IsEnum(LinkType)
  type: LinkType;

  @IsString()
  soulId: string;

  @IsString()
  code: string;
}
