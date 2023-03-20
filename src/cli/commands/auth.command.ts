import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
  Question,
  QuestionSet,
} from 'nest-commander';
import got from 'got';

@Command({
  name: 'auth',
})
export class AuthCommand extends CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const optionsWithPassword = await this.inquirerService.ask(
      'password',
      options,
    );
    const authResult = await got
      .post(`${optionsWithPassword['endpoint']}/auth/login`, {
        json: {
          username: optionsWithPassword['username'],
          password: optionsWithPassword['password'],
        },
      })
      .json();
    console.log(authResult);
    return Promise.resolve(undefined);
  }

  @Option({
    flags: '-u, --username <username>',
    description: 'Username to auth',
    required: true,
  })
  parseUsername(val: string) {
    return val;
  }

  @Option({
    flags: '-e, --endpoint <username>',
    description: 'Endpoint to auth',
    required: true,
    defaultValue: 'https://backend.dev.soulsearch.blaize.technology/api',
  })
  parseEndpoint(val: string) {
    return val;
  }
}
