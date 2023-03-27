import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Repository, FindOptionsSelect, ILike, In, Like } from 'typeorm';
import { Company, CompanyLink } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from 'companies/dto/create-company.dto';
import { ImagesService } from 'images/images.service';
import { CategoriesService } from 'categories/categories.service';
import { ImageCredentialsResponse } from 'companies/dto/image-credentials.response';
import { GenerateImageCredentialsDto } from 'companies/dto/generate-image-credentials.dto';
import { FindUniqCompanyDto } from 'companies/dto/find-uniq-company.dto';
import { MAX_SEARCH_LIMIT } from 'companies/constants/company-query.constants';
import { UpdateCompanyDto } from 'companies/dto/update-company.dto';
import { CompanyResolvedImagesDto } from 'companies/dto/company-resolved-images.dto';
import { CreateLinkDto } from 'companies/dto/create-update-link.dto';
import keyBy from 'lodash.keyby';
import { HttpRequest } from 'common/interfaces';
import { GraphService } from 'graph/graph.service';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import { NonceResponse } from 'companies/dto/nonce.response';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyLink)
    private readonly companyLinkRepository: Repository<CompanyLink>,
    private readonly imagesService: ImagesService,
    private readonly categoriesService: CategoriesService,
    private readonly graphService: GraphService,
    private readonly configService: ConfigService<ConfigSchema>,
  ) {}

  async createOne(data: CreateCompanyDto) {
    const {
      // backgroundImageKey,
      // logoImageKey,
      // featuredImageKey,
      categoriesIds,
      ...rest
    } = data;
    // const backgroundImage =
    //   backgroundImageKey &&
    //   (await this.imagesService.createImageFromKey(backgroundImageKey));
    //
    // const logoImage =
    //   logoImageKey &&
    //   (await this.imagesService.createImageFromKey(logoImageKey));
    //
    // const featuredImage =
    //   featuredImageKey &&
    //   (await this.imagesService.createImageFromKey(featuredImageKey));

    const chainCompanies = await this.graphService.getSbtCompanies({
      address: data.address,
    });

    if (!chainCompanies?.length) {
      throw new NotFoundException('Company not exist on chain');
    }

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
      // backgroundImage,
      // logoImage,
      // featuredImage,
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
      links,
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

    const linkToUpdate = await this.getLinksForCompany(existCompany, links);

    if (notFoundCategories.length) {
      throw new NotFoundException(
        `CategoryIds ${notFoundCategories.join(', ')} not found`,
      );
    }

    const saved = await this.companyRepository.save({
      id: existCompany.id,
      backgroundImage,
      logoImage,
      featuredImage,
      categories,
      links: linkToUpdate,
      ...rest,
    });

    return this.findOne({ id: saved.id });
  }

  async findManyByQuery(query: string) {
    return this.companyRepository.find({
      where: [
        {
          address: ILike(query),
        },
        {
          soulId: Like(`%${query}%`),
        },
        {
          name: ILike(`%${query}%`),
        },
      ],
      take: MAX_SEARCH_LIMIT,
    });
  }

  async findOne(
    where: FindUniqCompanyDto,
    select?: FindOptionsSelect<Company>,
  ) {
    return this.companyRepository.findOne({
      where: {
        ...where,
        ...(where.address && { address: ILike(where.address) }),
      },
      ...(select && { select }),
    });
  }

  async generateImageCredentials(
    where: FindUniqCompanyDto,
    data: GenerateImageCredentialsDto,
  ): Promise<ImageCredentialsResponse> {
    const existCompany = await this.findOne(where);
    if (!existCompany) {
      throw new NotFoundException(
        'Company not found, create company before upload image',
      );
    }
    const { id: companyId } = existCompany;
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

  async resolveCompanyImages(
    company: Company,
  ): Promise<CompanyResolvedImagesDto> {
    const { logoImage, featuredImage, backgroundImage, ...rest } = company;
    const [logoImageUrl, backgroundImageUrl, featuredImageUrl] =
      await Promise.all([
        this.imagesService.getImageUrl(logoImage),
        this.imagesService.getImageUrl(backgroundImage),
        this.imagesService.getImageUrl(featuredImage),
      ]);

    return {
      ...rest,
      logoImageUrl,
      backgroundImageUrl,
      featuredImageUrl,
    };
  }

  private async getLinksForCompany(
    company: Company,
    newLinks: CreateLinkDto[],
  ) {
    if (!newLinks) {
      return;
    }
    const linksToUpdate = await this.companyLinkRepository.find({
      where: {
        company: {
          id: company.id,
        },
        type: In(newLinks.map((l) => l.type)),
      },
    });

    const mapExist = keyBy(linksToUpdate, 'type');
    const updated = newLinks.reduce((accum, l) => {
      if (mapExist?.[l.type]?.verified && mapExist?.[l.type].url === l.url) {
        return accum;
      }
      return {
        ...accum,
        [l.type]: {
          ...(mapExist?.[l.type] ?? {}),
          type: l.type,
          url: l.url,
        },
      };
    }, mapExist);

    return Object.values(updated);
  }

  async retrieveCompanyNonce(
    where: FindUniqCompanyDto,
  ): Promise<NonceResponse> {
    const company = await this.findOne(where);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (!company.nonce || !company.nonceCreatedAt) {
      return this.refreshNonce(company);
    }

    const validUntil = new Date(
      company.nonceCreatedAt.getTime() +
        this.configService.get<number>('NONCE_VALID_TTL_SECONDS') * 1000,
    );
    if (validUntil < new Date()) {
      return this.refreshNonce(company);
    }

    return {
      nonce: company.nonce,
      validUntil,
    };
  }

  async ensureAddressRelatedToCompany(req: HttpRequest, soulId: string) {
    if (!req.address) {
      return;
    }
    const companyToCheckAddress = await this.findOne({
      soulId,
    });

    if (!companyToCheckAddress) {
      throw new NotFoundException('Company not exist');
    }

    if (
      companyToCheckAddress.address.toLowerCase() === req.address.toLowerCase()
    ) {
      return;
    }

    throw new ForbiddenException('You not allowed to update not yours company');
  }

  private async refreshNonce(company: Company) {
    const nonce = uuidv4();
    const nonceCreatedAt = new Date();
    await this.companyRepository.update(company.id, {
      nonce,
      nonceCreatedAt,
    });
    return {
      nonce,
      validUntil: new Date(
        nonceCreatedAt.getTime() +
          this.configService.get<number>('NONCE_VALID_TTL_SECONDS') * 1000,
      ),
    };
  }
}
