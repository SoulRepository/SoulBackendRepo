import { Module } from '@nestjs/common';
import { CompaniesCommand } from './companies.command';

@Module({
  providers: [CompaniesCommand],
})
export class CompaniesModule {}
