import { UserRepository } from './../models/user/user.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/models/user/user.service';
import { errorMessages } from './constants/error-messages';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.userService.createUser(registerDto);
  }

  async login(userId: number) {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    return { accessToken };
  }

  async validateUser(params: {
    email: string;
    password: string;
  }): Promise<{ userId: number }> {
    const { email, password } = params;

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenException(errorMessages.forbidden.invalidLoginData);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new ForbiddenException(errorMessages.forbidden.invalidLoginData);
    }

    return { userId: user.id };
  }
}
