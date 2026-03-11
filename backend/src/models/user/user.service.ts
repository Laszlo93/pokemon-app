import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: RegisterDto) {
    const { password } = createUserDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const userDataWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userRepository.createUser(userDataWithHashedPassword);
  }
}
