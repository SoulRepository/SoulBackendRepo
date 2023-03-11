import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import { Repository } from 'typeorm';
import { Image } from 'entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageType } from 'images/intefaces/image.types';
import { IMAGE_KEY_RE } from 'images/constants/validation.constants';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ImagesService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService<ConfigSchema>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  findOneByKey(key: string) {
    return this.imageRepository.findOne({
      where: {
        key,
      },
    });
  }

  deleteKey(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('IMAGES_S3_BUCKET'),
      Key: key,
    });
    return this.s3Client.send(command);
  }

  async createImageFromKey(key: string) {
    const parsedKey = this.parseKey(key);
    if (!parsedKey) {
      throw new BadRequestException(`Invalid Key, ${key}`);
    }

    const cmd = new HeadObjectCommand({
      Bucket: this.configService.get('IMAGES_S3_BUCKET'),
      Key: key,
    });
    const data = await this.s3Client.send(cmd);
    if (!data) {
      throw new BadRequestException(`Image from key ${key}, not loaded`);
    }

    const { $metadata, ...restMetadata } = data;

    const entity = this.imageRepository.create({
      metadata: restMetadata,
      key,
    });

    // TODO: implement ability to delete old images

    return this.imageRepository.save(entity);
  }

  getImageUrl(image: Image) {
    if (!image) {
      return;
    }
    const cdnUrl = this.configService.get('IMAGES_S3_CDN');
    if (cdnUrl) {
      return `${cdnUrl}/${image.key}`;
    }
    const cmd = new GetObjectCommand({
      Bucket: this.configService.get('IMAGES_S3_BUCKET'),
      Key: image.key,
    });
    return getSignedUrl(this.s3Client, cmd, { expiresIn: 3600 });
  }

  createPresignDataForCompany(companyId: number, imageType: ImageType) {
    const ts = Date.now();
    return this.createImagePresignedData(
      this.createKey('companies', companyId, imageType, ts),
    );
  }

  private async createImagePresignedData(key: string) {
    return createPresignedPost(this.s3Client, {
      Bucket: this.configService.get('IMAGES_S3_BUCKET'),
      Key: key,
      Expires: 3600,
      Conditions: [
        [
          'content-length-range',
          0,
          this.configService.get<number>('IMAGES_S3_LIMIT'),
        ],
        ['starts-with', '$Content-Type', ''],
      ],
    });
  }

  private createKey(
    entity: string,
    entityId: string | number,
    imageType: string,
    ts: string | number,
  ) {
    return `${entity}/${entityId}/images/${imageType}-${ts}`;
  }

  private parseKey(key: string) {
    const matches = key.match(IMAGE_KEY_RE);
    if (!matches) {
      return;
    }

    const [, entity, entityId, subType, type, ts] = matches;
    return {
      entity,
      entityId,
      subType,
      type,
      ts,
    };
  }
}
