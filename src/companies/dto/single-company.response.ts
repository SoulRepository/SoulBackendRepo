import { LinkType } from 'entities/enums/link-type.enum';

export class SingleCompanyLinkResponse {
  type: LinkType;
  url: string;
}

export class SingleCompanyCategoryResponse {
  id: number;
  name: string;
}

export class SingleCompanyResponse {
  name: string;
  description: string;
  soulId: string;
  links: SingleCompanyLinkResponse[];
  joinDate: Date;
  backgroundImage: string;
  logoImage: string;
  categories: SingleCompanyCategoryResponse[];
  address: string;
}