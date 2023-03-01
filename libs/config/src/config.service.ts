import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import {
  ClassType,
  transformAndValidateSync,
} from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

import { ConfigSchema } from './config.types';

@Injectable()
export class ConfigService<T = any> {
  private readonly envConfig: ConfigSchema;

  private static readonly schemaToService = new Map();

  constructor(private readonly envSchema: ClassType<T>) {
    this.loadEnv();
    this.envConfig = this.getTransformedSchema();
  }

  static create<Y = ConfigSchema>(envSchema: ClassType<Y>): ConfigService<Y> {
    if (this.schemaToService.has(envSchema)) {
      return this.schemaToService.get(envSchema);
    }
    const instance = new ConfigService(envSchema);
    this.schemaToService.set(envSchema, instance);
    return instance;
  }

  private loadEnv(): void {
    try {
      const dotenvPath = resolve(
        process.cwd(),
        process.env['ENV_FILE'] || '.env',
      );
      const envData = dotenv.parse(readFileSync(dotenvPath, 'utf-8'));
      Object.assign(process.env, envData);
    } catch (e) {
      /* ignore error */
    }
  }

  private getTransformedSchema(): ConfigSchema {
    try {
      return transformAndValidateSync(this.envSchema as any, process.env);
    } catch (errors) {
      const error = this.getValidationError(errors as ValidationError[]);
      throw new Error(`EnvSchema validation error: ${error}`);
    }
  }

  private getValidationError(errors: ValidationError[]): string | null {
    const [error] = errors;
    if (!error.constraints) return null;
    const [errorKey] = Object.keys(error.constraints);
    return error.constraints[errorKey];
  }

  get<Y>(key: keyof T): Y {
    return (this.envConfig as any)[key];
  }
}
