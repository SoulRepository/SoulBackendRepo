import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from 'companies/companies.module';
import { ImagesModule } from 'images/images.module';
import { ConfigModule } from '@common/config';
import { ConfigSchema } from './config/config.schema';
import { ContractsModule } from 'contracts/contracts.module';
import { CategoriesModule } from 'categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './database/datasource';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
