import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/datebase/prisma/prisma.service';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';

@Injectable()
export class PokemonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async catchPokemon(params: {
    userId: number;
    catchPokemonDto: CatchPokemonDto;
  }) {
    const { userId, catchPokemonDto } = params;

    return this.prisma.caughtPokemon.create({
      data: {
        userId,
        pokemonId: catchPokemonDto.pokemonId,
      },
    });
  }
}
