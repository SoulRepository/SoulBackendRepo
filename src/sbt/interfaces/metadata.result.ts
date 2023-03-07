export interface MetadataResult {
  metadataObjects: {
    id: string;
    sbtId: string;
    digiProofType: {
      id: string;
    };
    description: string;
    uri: string;
    companies: {
      id: string;
      address: string;
    }[];
  }[];
}
