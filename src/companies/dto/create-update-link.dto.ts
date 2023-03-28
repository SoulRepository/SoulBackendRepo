import { IsEnum } from 'class-validator';
import { LinkType } from 'entities/enums/link-type.enum';
import { IsValidSocialLink } from 'companies/decorators/is-valid-social-link.decorator';

export class CreateLinkDto {
  @IsEnum(LinkType)
  type: LinkType;

  @IsValidSocialLink('type')
  url: string;
}
