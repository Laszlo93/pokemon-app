import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../prisma/generated/client';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function getDatabaseUrl(configService: ConfigService): string {
  const url = configService.get<string>('db.url');

  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error(
      'Database URL is not set. Configure db.url or DATABASE_URL in config/env.',
    );
  }

  return url.trim();
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const url = getDatabaseUrl(configService);
    const adapter = new PrismaMariaDb(url);

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
