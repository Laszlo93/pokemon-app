import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListCaughtPokemonsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by pokemon name (partial match)',
    example: 'pika',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by pokemon type (exact match on one type)',
    example: 'electric',
  })
  @IsOptional()
  @IsString()
  type?: string;
}
