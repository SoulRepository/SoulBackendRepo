import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { DigiProofListResponse } from './dto/digi-proof-list.response';
import { DigiProofResult } from './interfaces/digi-proof.result';

@Injectable()
export class DigiProofsService {
  constructor(private readonly graphService: GraphService) {}

  async getDigiProofs(): Promise<DigiProofListResponse[]> {
    const { data } = await this.graphService.sendQuery<DigiProofResult>(
      'get-digi-proofs',
    );
    return data.digiProofTypes.map((d) => ({
      name: d.id,
    }));
  }
}
