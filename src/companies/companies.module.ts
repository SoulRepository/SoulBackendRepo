import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyLink, Company } from 'entities';
import { ImagesModule } from 'images/images.module';
import { CategoriesModule } from 'categories/categories.module';
import { GraphModule } from 'graph/graph.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyLink]),
    ImagesModule,
    CategoriesModule,
    GraphModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
