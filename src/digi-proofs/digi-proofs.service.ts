import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { DigiProofListResponse } from './dto/digi-proof-list.response';

@Injectable()
export class DigiProofsService {
  constructor(private readonly graphService: GraphService) {}

  async getDigiProofs(): Promise<DigiProofListResponse[]> {
    const data = await this.graphService.getDigiProofs();
    return data.digiProofTypes.map((d) => ({
      name: d.id,
    }));
  }
}
