import { Module } from '@nestjs/common';
import { SbtService } from './sbt.service';
import { SbtController } from './sbt.controller';
import { GraphModule } from 'graph/graph.module';
import { CompaniesModule } from 'companies/companies.module';
import { ImagesModule } from 'images/images.module';

@Module({
  imports: [GraphModule, CompaniesModule, ImagesModule],
  providers: [SbtService],
  controllers: [SbtController],
})
export class SbtModule {}
