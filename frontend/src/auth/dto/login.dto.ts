import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({ allow_utf8_local_part: false })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;
}
