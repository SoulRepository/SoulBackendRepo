import { Module } from '@nestjs/common';
import { AuthCommand } from './commands/auth.command';
import { CompaniesCommand } from './commands/companies.command';
import { AuthPasswordQuestion } from './commands/auth-password.question';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from './http-client/http-client.module';
import { CreateCompanyQuestion } from './commands/create-company.question';

@Module({
  providers: [
    AuthCommand,
    CompaniesCommand,
    AuthPasswordQuestion,
    CreateCompanyQuestion,
  ],
  imports: [AuthModule, HttpClientModule],
})
export class CliModule {}
