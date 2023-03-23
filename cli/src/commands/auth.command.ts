import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { AuthService } from '../auth/auth.service';
import { HttpClientService } from '../http-client/http-client.service';

@Command({
  name: 'auth',
})
export class AuthCommand extends CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly authService: AuthService,
    private readonly httpClientService: HttpClientService,
  ) {
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
    const { username, password, endpoint } = optionsWithPassword;
    const token = await this.httpClientService.login(
      username,
      password,
      endpoint,
    );

    await this.authService.persistAuthData(endpoint, token);
    console.log('Auth successfully');
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
