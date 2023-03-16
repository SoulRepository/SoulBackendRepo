import { LinkType } from 'entities';
import { IsEnum } from 'class-validator';

export class GetSocialLinkParamsDto {
  @IsEnum(LinkType)
  type: LinkType;
}
