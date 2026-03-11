import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { classValidatorConfig } from './common/config/class-validator.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe(classValidatorConfig));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
