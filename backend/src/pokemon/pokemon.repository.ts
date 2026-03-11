import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/datebase/prisma/prisma.service';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';
import { ListCaughtPokemonsQueryDto } from './dto/list-caught-pokemons.query.dto';

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
        ...catchPokemonDto,
      },
    });
  }

  async releasePokemon(params: { userId: number; pokemonId: number }) {
    const { userId, pokemonId } = params;

    return this.prisma.caughtPokemon.delete({
      where: { userId_pokemonId: { userId, pokemonId } },
    });
  }

  async findManyByUserId(params: {
    userId: number;
    query: ListCaughtPokemonsQueryDto;
  }) {
    const { userId, query } = params;

    return this.prisma.caughtPokemon.findMany({
      where: {
        userId,
        name: query.name?.trim() ? { contains: query.name.trim() } : undefined,
        types: query.type?.trim()
          ? { array_contains: query.type.trim() }
          : undefined,
      },
      orderBy: { caughtAt: 'desc' },
    });
  }
}
