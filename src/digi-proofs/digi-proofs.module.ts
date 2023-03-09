import { Module } from '@nestjs/common';
import { DigiProofsController } from './digi-proofs.controller';
import { DigiProofsService } from './digi-proofs.service';
import { GraphModule } from '../graph/graph.module';

@Module({
  controllers: [DigiProofsController],
  providers: [DigiProofsService],
  imports: [GraphModule],
})
export class DigiProofsModule {}
