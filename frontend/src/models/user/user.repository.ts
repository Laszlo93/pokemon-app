import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/providers/datebase/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: RegisterDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}
