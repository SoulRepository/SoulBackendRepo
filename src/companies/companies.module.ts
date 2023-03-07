import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyLink, Company } from 'entities';
import { ImagesModule } from 'images/images.module';
import { CategoriesModule } from 'categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyLink]),
    ImagesModule,
    CategoriesModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
