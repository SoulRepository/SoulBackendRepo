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
        const endpoint = configService.get<string>('IMAGES_S3_ENDPOINT');
        const accessKeyId = configService.get<string>('IMAGES_S3_ACCESS_KEY');
        const secretAccessKey = configService.get<string>(
          'IMAGES_S3_SECRET_KEY',
        );

        return new S3Client({
          ...(endpoint && { endpoint }),
          region: configService.get('IMAGES_S3_REGION'),
          ...(accessKeyId &&
            secretAccessKey && {
              credentials: {
                accessKeyId,
                secretAccessKey,
              },
            }),
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
