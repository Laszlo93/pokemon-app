import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'prisma/generated/client';

export class UserResponseDto implements User {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;
}
