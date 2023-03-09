import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from 'categories/categories.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.findMany();
  }
}
