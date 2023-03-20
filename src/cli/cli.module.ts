import { Module } from '@nestjs/common';
import { AuthCommand } from './commands/auth.command';
import { CompaniesCommand } from './commands/companies.command';
import { AuthPasswordQuestion } from './commands/auth-password.question';

@Module({
  providers: [AuthCommand, CompaniesCommand, AuthPasswordQuestion],
})
export class CliModule {}
