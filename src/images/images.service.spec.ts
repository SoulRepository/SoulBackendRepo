import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { ConfigService } from '@common/config';
import { Repository } from 'typeorm';
import { Image } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { ConfigSchema } from '../config/config.schema';
import { IMAGE_KEY_RE } from 'images/constants/validation.constants';
import { ImageType } from 'images/intefaces/image.types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
            send: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Repository,
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
    imageRepository = module.get<Repository<Image>>(Repository);
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

  describe('deleteKey', () => {
    it('should call s3Client.send with correct arguments', async () => {
      const expectedKey = 'test-key';
      const expectedBucket = 'test-bucket';
      jest.spyOn(configService, 'get').mockReturnValue(expectedBucket);
      const expectedCommand = new DeleteObjectCommand({
        Bucket: expectedBucket,
        Key: expectedKey,
      });
      await service.deleteKey(expectedKey);
      expect(s3Client.send).toHaveBeenCalledWith(expectedCommand);
    });
  });

  describe('createImageFromKey', () => {
    const mockKey = 'random key';
    const mockBucket = 'test-bucket';
    const mockMetadata = {
      size: 123,
      contentType: 'image/jpeg',
    };

    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue(mockBucket);
    });

    it('should throw BadRequestException if key is invalid', async () => {
      await expect(service.createImageFromKey(mockKey)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
