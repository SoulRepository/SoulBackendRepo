import { Command, Option, CommandRunner } from 'nest-commander';

@Command({
  name: 'companies',
})
export class CompaniesCommand extends CommandRunner {
  run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    return Promise.resolve(undefined);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    return val;
  }
}
