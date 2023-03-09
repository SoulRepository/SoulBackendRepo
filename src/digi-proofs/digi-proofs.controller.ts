import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DigiProofsService } from './digi-proofs.service';

@Controller('digi-proofs')
@ApiTags('Digi Proofs')
export class DigiProofsController {
  constructor(private readonly digiProofsService: DigiProofsService) {}

  @Get('digi-proofs')
  getDigiProofs() {
    return this.digiProofsService.getDigiProofs();
  }
}
