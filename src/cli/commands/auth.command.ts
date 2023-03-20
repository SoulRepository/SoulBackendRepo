import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
  Question,
  QuestionSet,
} from 'nest-commander';
import got from 'got';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as os from 'os';
import { TokenResponse } from 'auth/interfaces';

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
      .json<TokenResponse>();

    const cliConfigDir = path.resolve(os.homedir(), '.soul-cli');
    await fs.mkdir(cliConfigDir, { recursive: true });

    await fs.writeFile(
      path.resolve(cliConfigDir, 'config.json'),
      JSON.stringify({
        endpoint: optionsWithPassword['endpoint'],
        token: authResult.token,
      }),
    );
    return;
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
