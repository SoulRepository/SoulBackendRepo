import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getPackageVersion } from 'common/utils/version.util';
import { ConfigService } from '@common/config';
import { ConfigSchema } from './config/config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  const configService = app.get<ConfigService<ConfigSchema>>(ConfigService);

  const swaggerOptions = new DocumentBuilder()
    .setTitle(configService.get<string>('SERVICE_NAME'))
    .setDescription('Soul Search')
    .setVersion(getPackageVersion())
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('api', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(configService.get('PORT'), configService.get('HOST'));
}
bootstrap();
