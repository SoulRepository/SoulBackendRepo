import { Injectable } from '@nestjs/common';
import { GraphService } from 'graph/graph.service';
import { DigiProofListResponse } from './dto/digi-proof-list.response';
import { INIT_DIGI_PROOFS } from 'digi-proofs/digi-proofs.constants';

@Injectable()
export class DigiProofsService {
  constructor(private readonly graphService: GraphService) {}

  async getDigiProofs(): Promise<DigiProofListResponse[]> {
    const data = await this.graphService.getDigiProofs();
    const digiProofsSet = new Set(INIT_DIGI_PROOFS);
    data.digiProofTypes.forEach((i) => digiProofsSet.add(i.id));
    return [...digiProofsSet].map((d) => ({
      name: d,
    }));
  }
}
