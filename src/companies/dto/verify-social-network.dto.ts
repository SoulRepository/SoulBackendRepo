import { LinkType } from 'entities';

export class VerifySocialNetworkDto {
  type: LinkType.INSTAGRAM | LinkType.DISCORD | LinkType.TWITTER;
  code: string;
}
