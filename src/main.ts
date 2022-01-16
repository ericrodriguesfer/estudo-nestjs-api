import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Study Nest API')
    .setDescription(
      'an api intended for my nestjs studies and its best practices',
    )
    .setVersion('1.0')
    .addTag('Study')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.API_PORT || 3333);
}

bootstrap();
