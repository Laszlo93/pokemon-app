import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CatchPokemonDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  pokemonId: number;
}
