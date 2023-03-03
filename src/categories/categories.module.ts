import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'entities';
import { CategoriesService } from 'categories/categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  exports: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
