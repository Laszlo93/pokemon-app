import { ApiProperty } from '@nestjs/swagger';

export class CaughtPokemonResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 25 })
  pokemonId: number;

  @ApiProperty({ example: ['grass', 'poison'] })
  types: string[];

  @ApiProperty({ example: '2025-03-11T14:00:00.000Z' })
  caughtAt: Date;
}
