import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { errorMessages } from './constants/error-messages';
import { LoginResponseDto } from './dto/login.response.dto';
import { RequestWithUser } from './types/types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

const PATHS = {
  basePath: 'auth',
  register: 'register',
  login: 'login',
};

@Controller(PATHS.basePath)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(PATHS.register)
  @ApiCreatedResponse({
    description: 'Returns the created user',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: errorMessages.badRequest.validationErrorRegister,
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return plainToInstance(UserResponseDto, user);
  }

  @Public()
  @Post(PATHS.login)
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Logged in succesfully',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: errorMessages.badRequest.validationErrorLogin,
  })
  @ApiForbiddenResponse({
    description: errorMessages.forbidden.invalidLoginData,
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  login(@Request() req: RequestWithUser, @Body() _loginDto: LoginDto) {
    const { userId } = req.user;

    return this.authService.login(userId);
  }
}
