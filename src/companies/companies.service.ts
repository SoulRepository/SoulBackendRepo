import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository, FindOptionsSelect } from 'typeorm';
import { Company } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { ImagesService } from 'images/images.service';
import { CategoriesService } from 'categories/categories.service';
import { ImageCredentialsResponse } from 'companies/dto/image-credentials.response';
import { GenerateImageCredentialsDto } from 'companies/dto/generate-image-credentials.dto';
import { FindUniqCompanyDto } from 'companies/dto/find-uniq-company.dto';
import { MAX_SEARCH_LIMIT } from 'companies/constants/company-query.constants';
import { UpdateCompanyDto } from 'companies/dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly imagesService: ImagesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createOne(data: CreateCompanyDto) {
    const {
      backgroundImageKey,
      logoImageKey,
      featuredImageKey,
      categoriesIds,
      ...rest
    } = data;
    const backgroundImage =
      backgroundImageKey &&
      (await this.imagesService.createImageFromKey(backgroundImageKey));

    const logoImage =
      logoImageKey &&
      (await this.imagesService.createImageFromKey(logoImageKey));

    const featuredImage =
      featuredImageKey &&
      (await this.imagesService.createImageFromKey(featuredImageKey));

    const categories = await this.categoriesService.findByIds(categoriesIds);
    const notFoundCategories = categoriesIds.filter(
      (c) => !categories.some((p) => p.id === c),
    );

    if (notFoundCategories.length) {
      throw new NotFoundException(
        `CategoryIds ${notFoundCategories.join(', ')} not found`,
      );
    }

    const entity = this.companyRepository.create({
      ...rest,
      categories: categoriesIds.map((id) => ({ id: id })),
      backgroundImage,
      logoImage,
      featuredImage,
    });
    const saved = await this.companyRepository.save(entity);
    return this.findOne({ id: saved.id });
  }

  async updateOne(
    where: FindUniqCompanyDto,
    data: UpdateCompanyDto,
  ): Promise<Company> {
    const existCompany = await this.findOne(where);
    if (!existCompany) {
      throw new NotFoundException(`Company not exist`);
    }
    const {
      backgroundImageKey,
      logoImageKey,
      featuredImageKey,
      categoriesIds,
      ...rest
    } = data;
    const backgroundImage =
      backgroundImageKey &&
      (await this.imagesService.createImageFromKey(backgroundImageKey));

    const logoImage =
      logoImageKey &&
      (await this.imagesService.createImageFromKey(logoImageKey));

    const featuredImage =
      featuredImageKey &&
      (await this.imagesService.createImageFromKey(featuredImageKey));

    const categories =
      categoriesIds && (await this.categoriesService.findByIds(categoriesIds));
    const notFoundCategories = categoriesIds
      ? categoriesIds.filter((c) => !categories.some((p) => p.id === c))
      : [];

    if (notFoundCategories.length) {
      throw new NotFoundException(
        `CategoryIds ${notFoundCategories.join(', ')} not found`,
      );
    }

    const entity = this.companyRepository.merge(existCompany, {
      backgroundImage,
      logoImage,
      featuredImage,
      categories,
      ...rest,
    });
    const saved = await this.companyRepository.save(entity);

    return this.findOne({ id: saved.id });
  }

  async findManyByQuery(query: string) {
    return this.companyRepository.find({
      where: [
        {
          address: query,
        },
        {
          soulId: Like(`%${query}%`),
        },
      ],
      take: MAX_SEARCH_LIMIT,
    });
  }

  async findOne(
    where: FindUniqCompanyDto,
    select?: FindOptionsSelect<Company>,
  ) {
    return this.companyRepository.findOne({ where, ...(select && { select }) });
  }

  async generateImageCredentials(
    where: FindUniqCompanyDto,
    data: GenerateImageCredentialsDto,
  ): Promise<ImageCredentialsResponse> {
    const existCompany = await this.findOne(where);
    const companyId = existCompany ? existCompany.id : -1;
    return {
      background:
        data.forBackground &&
        (await this.imagesService.createPresignDataForCompany(
          companyId,
          'background',
        )),
      featured:
        data.forFeatured &&
        (await this.imagesService.createPresignDataForCompany(
          companyId,
          'featured',
        )),
      logo:
        data.forLogo &&
        (await this.imagesService.createPresignDataForCompany(
          companyId,
          'logo',
        )),
    };
  }
}
