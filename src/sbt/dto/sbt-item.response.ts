export class SbtItemCompanyResponse {
  name: string;
  featuredImage: string;
  logo: string;
  soulId: string;
  address: string;
  verified: boolean;
  synced: boolean;
}

export class SbtItemResponse {
  sbtId: string;
  digiProofType: string;
  description: string;
  uri: string;
  companies: SbtItemCompanyResponse[];
  createdAt: Date;
}
