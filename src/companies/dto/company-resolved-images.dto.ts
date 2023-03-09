import { Company } from 'entities';

export class CompanyResolvedImagesDto extends Company {
  backgroundImageUrl?: string;
  logoImageUrl?: string;
  featuredImageUrl?: string;
}
