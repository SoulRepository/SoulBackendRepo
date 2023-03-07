import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { CompaniesModule } from 'companies/companies.module';
import { ImagesModule } from 'images/images.module';
import { ConfigModule } from '@common/config';
import { ConfigSchema } from './config/config.schema';
import { ContractsModule } from 'contracts/contracts.module';
import { CategoriesModule } from 'categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './database/datasource';
import { AdminsModule } from './admins/admins.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeormExceptionFilter } from 'common/database/typeorm-exception.filter';
import { GraphModule } from './graph/graph.module';
import { SbtModule } from './sbt/sbt.module';

@Module({
  imports: [
    CompaniesModule,
    ImagesModule,
    ConfigModule.register(ConfigSchema),
    ContractsModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      ...dbConfig,
      autoLoadEntities: true,
      retryAttempts: 10,
    }),
    AdminsModule,
    GraphModule,
    SbtModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: TypeormExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        enableDebugMessages: true,
        skipUndefinedProperties: false,
        skipNullProperties: false,
        skipMissingProperties: false,
        whitelist: true,
        // forbidNonWhitelisted: true, // will throw error
        forbidUnknownValues: true,
        disableErrorMessages: false, // throw error
      }),
    },
  ],
})
export class AppModule {}
