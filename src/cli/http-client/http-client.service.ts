import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import got, { Got } from 'got';
import { TokenResponse } from 'auth/interfaces';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { Company } from 'entities';

@Injectable()
export class HttpClientService implements OnModuleInit {
  private client: Got;
  constructor(private readonly authService: AuthService) {}

  async login(
    username: string,
    password: string,
    endpoint: string,
  ): Promise<string> {
    const authResult = await got
      .post(`${endpoint}/auth/login`, {
        json: {
          username,
          password,
        },
      })
      .json<TokenResponse>();

    return authResult.token;
  }

  createCompany(data: CreateCompanyDto) {
    return this.client
      .post('companies', {
        json: data,
      })
      .json<Company>();
  }

  async onModuleInit(): Promise<void> {
    const authData = await this.authService.getAuthData();
    if (!authData) {
      return;
    }
    this.client = got.extend({
      prefixUrl: authData.endpoint,
      headers: {
        authorization: `Bearer ${authData.token}`,
      },
    });
  }
}
