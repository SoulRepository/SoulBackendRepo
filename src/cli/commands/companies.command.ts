import {
  Command,
  Option,
  CommandRunner,
  InquirerService,
} from 'nest-commander';

@Command({
  name: 'companies',
})
export class CompaniesCommand extends CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
    required: true,
  })
  parseString(val: string): string {
    return val;
  }
}
