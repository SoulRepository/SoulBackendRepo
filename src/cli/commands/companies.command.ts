import {
  Command,
  Option,
  CommandRunner,
  InquirerService,
} from 'nest-commander';
import { HttpClientService } from '../http-client/http-client.service';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';

@Command({
  name: 'create-company',
})
export class CompaniesCommand extends CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly httpClientService: HttpClientService,
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const data = await this.inquirerService.ask('create-company', options);
    try {
      const result = await this.httpClientService.createCompany({
        ...(data as CreateCompanyDto),
        categoriesIds: [],
        links: [],
      });
      console.log(result);
    } catch (e) {
      const parsed = JSON.parse(e?.response?.body ?? 'null');
      if (parsed) {
        console.log(parsed);
      }
    }
  }
}
