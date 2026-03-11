import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { errorMessages } from './constants/error-messages';

const PATHS = {
  basePath: 'auth',
  register: 'register',
};

@Controller(PATHS.basePath)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(PATHS.register)
  @ApiCreatedResponse({
    description: 'Returns the created user',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: errorMessages.validationError,
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return plainToInstance(UserResponseDto, user);
  }
}
