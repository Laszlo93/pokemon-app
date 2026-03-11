import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { classValidatorConfig } from './common/config/class-validator.config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const jwtAuthGuard = app.get(JwtAuthGuard);

  app.useGlobalPipes(new ValidationPipe(classValidatorConfig));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalGuards(jwtAuthGuard);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
