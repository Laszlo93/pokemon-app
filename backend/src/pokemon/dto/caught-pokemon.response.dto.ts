import { ApiProperty } from '@nestjs/swagger';
import { CaughtPokemon } from 'prisma/generated/client';

export class CaughtPokemonResponseDto implements CaughtPokemon {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 25 })
  pokemonId: number;

  @ApiProperty({ example: 'Pikachu' })
  name: string;

  @ApiProperty({ example: ['grass', 'poison'] })
  types: string[];

  @ApiProperty({ example: '2025-03-11T14:00:00.000Z' })
  caughtAt: Date;
}
