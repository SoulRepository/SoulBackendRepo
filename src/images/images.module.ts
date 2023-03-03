import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'entities';
import { ImagesService } from './images.service';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@common/config';
import { ConfigSchema } from '../config/config.schema';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [
    ImagesService,
    {
      provide: S3Client,
      useFactory(configService: ConfigService<ConfigSchema>) {
        return new S3Client({
          endpoint: configService.get('IMAGES_S3_ENDPOINT'),
          region: configService.get('IMAGES_S3_REGION') ?? 'us-east-1',
          credentials: {
            accessKeyId: configService.get('IMAGES_S3_ACCESS_KEY'),
            secretAccessKey: configService.get('IMAGES_S3_SECRET_KEY'),
          },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
