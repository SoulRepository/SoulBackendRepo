import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@common/config';
import { Repository } from 'typeorm';
import { Image } from 'entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { ConfigSchema } from '../config/config.schema';

describe('ImagesService', () => {
  let service: ImagesService;
  let s3Client: S3Client;
  let configService: ConfigService<ConfigSchema>;
  let imageRepository: Repository<Image>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: S3Client,
          useValue: {
            send: jest.fn(() => {
              return {
                $metadata: {},
              };
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Image),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    s3Client = module.get<S3Client>(S3Client);
    configService = module.get<ConfigService<ConfigSchema>>(ConfigService);
    imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findOneByKey', () => {
    it('should call imageRepository.findOne with correct argument', async () => {
      const expectedKey = 'test-key';
      await service.findOneByKey(expectedKey);
      expect(imageRepository.findOne).toHaveBeenCalledWith({
        where: {
          key: expectedKey,
        },
      });
    });
  });

  describe('createImageFromKey', () => {
    const mockBucket = 'test-bucket';

    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue(mockBucket);
    });

    it('should throw BadRequestException if key is invalid', async () => {
      const mockInvalidKey = 'random key';
      await expect(service.createImageFromKey(mockInvalidKey)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call s3 with correct key', async () => {
      const mockValidKey = 'companies/1/images/background-1221';
      await service.createImageFromKey(mockValidKey);
      // jest.spyOn(s3Client, 'send').mockReturnValue();
      await expect(imageRepository.save).toHaveBeenCalled();
    });
  });
});
