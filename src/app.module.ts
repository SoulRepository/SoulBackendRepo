import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
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
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeormExceptionFilter } from 'common/database/typeorm-exception.filter';
import { GraphModule } from './graph/graph.module';
import { SbtModule } from './sbt/sbt.module';
import { DigiProofsModule } from './digi-proofs/digi-proofs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './auth/auth.middleware';

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
    GraphModule,
    AuthModule,
    UsersModule,
    SbtModule,
    DigiProofsModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
