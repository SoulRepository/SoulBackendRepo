export class MetadataHostCompany {
  name: string;
  logo: string;
  soulId: string;
}

export class MetadataSubCompany {
  name: string;
  featuredImage: string;
  soulId: string;
  address: string;
}

export class CompanyWithMetadataResponse {
  hostCompany: MetadataHostCompany;
  sbt: {
    digiProofType: string;
  };

  subCompanies: MetadataSubCompany[];
}
