import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Category } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findByIds(ids: number[]) {
    return this.categoryRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findMany() {
    return this.categoryRepository.find();
  }
}
