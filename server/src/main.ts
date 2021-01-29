import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unvanted props from request
      transform: true, // transform input obj to DTO or (@Param('id') id: number) not string
      forbidNonWhitelisted: true, // forbid unvanted props from request
      transformOptions: {
        enableImplicitConversion: true, // transform query and try to cast the value from string to number
      },
    }),
  );

  await app.listen(PORT);
}

bootstrap();
