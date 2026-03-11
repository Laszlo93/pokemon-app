import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Min } from 'class-validator';

export class CatchPokemonDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  pokemonId: number;

  @IsString()
  @ApiProperty({ example: 'Pikachu' })
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['grass', 'poison'] })
  types: string[];
}
