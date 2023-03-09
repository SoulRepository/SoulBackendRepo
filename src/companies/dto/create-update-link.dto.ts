import { IsEnum, IsUrl } from 'class-validator';
import { LinkType } from 'entities/enums/link-type.enum';

export class CreateLinkDto {
  @IsEnum(LinkType)
  type: LinkType;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  url: string;
}
