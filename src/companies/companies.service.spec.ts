import { GraphService } from 'graph/graph.service';
import { CategoriesService } from 'categories/categories.service';
import { Company, CompanyLink, Image } from 'entities';
import { Repository } from 'typeorm';
import { CompaniesService } from 'companies/companies.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from 'images/images.service';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@common/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigSchema } from '../config/config.schema';

describe('CompaniesService', () => {
  let graphService: GraphService;
  let categoriesService: CategoriesService;
  let companyRepository: Repository<Company>;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: GraphService,
          useValue: {
            getSbtCompanies: jest.fn(),
          },
        },
        {
          provide: ImagesService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: CategoriesService,
          useValue: {
            findByIds: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CompanyLink),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    graphService = module.get<GraphService>(GraphService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new company', async () => {
    const mockCompany: Company = {
      name: 'New Company',
      address: '123 Main St',
      categories: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: null,
      soulId: '1234.soul',
      links: null,
    };
    jest
      .spyOn(graphService, 'getSbtCompanies')
      .mockResolvedValue([
        { id: '1234', name: 'New Company', address: '123 Main St' },
      ]);
    jest.spyOn(categoriesService, 'findByIds').mockResolvedValue([
      {
        id: 1,
        name: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Category 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Category 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(companyRepository, 'create').mockReturnValue(mockCompany);
    jest.spyOn(companyRepository, 'save').mockResolvedValue(mockCompany);
    jest.spyOn(companyRepository, 'findOne').mockResolvedValue(mockCompany);

    const result = await service.createOne({
      name: 'New Company',
      address: '123 Main St',
      description: '',
      categoriesIds: [1, 2, 3],
      links: [],
      soulId: '1234.soul',
    });
    expect(result.soulId).toEqual(mockCompany.soulId);
  });

  it('should find companies by query', async () => {
    const mockCompanies = [
      { id: 1, name: 'Company 1', address: '123 Main St' },
      { id: 2, name: 'Company 2', address: '456 Elm St' },
    ];
    jest.spyOn(companyRepository, 'find').mockResolvedValue(mockCompanies as Company[]);

    const result = await service.findManyByQuery('company');
    expect(result).toEqual(mockCompanies);
  });
});
