import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthData } from './dto/auth-data.dto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CLI_AUTH_FILE, CLI_CONFIG_DIR } from './auth.constants';

@Injectable()
export class AuthService {
  async persistAuthData(endpoint: string, token: string) {
    const toStore = JSON.stringify({
      endpoint,
      token,
    });
    await fs.writeFile(path.resolve(CLI_CONFIG_DIR, CLI_AUTH_FILE), toStore);
  }

  async getAuthData() {
    try {
      const data = await fs.readFile(
        path.resolve(CLI_CONFIG_DIR, CLI_AUTH_FILE),
        'utf-8',
      );
      return plainToInstance(AuthData, JSON.parse(data));
    } catch (e) {
      console.error(e);
      console.log('Auth file not valid, skip');
      return;
    }
  }
}
