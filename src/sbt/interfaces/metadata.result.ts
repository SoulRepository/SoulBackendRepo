export interface MetadataCompanyResult {
  id: string;
  address: string;
  name: string;
}

export interface MetadataObject {
  id: string;
  sbtId: string;
  digiProofType: {
    id: string;
  };
  description: string;
  uri: string;
  companies: MetadataCompanyResult[];
}

export interface MetadataResult {
  metadataObjects: MetadataObject[];
}

export interface MetadataSingleResult {
  metadataObject: MetadataObject;
}
