import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'supersecret-access-token' })
  accessToken: string;
}
