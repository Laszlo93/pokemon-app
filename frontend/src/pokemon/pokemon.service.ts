import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/client';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';
import { PokemonRepository } from './pokemon.repository';
import { errorMessages } from './constants/error-messages';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async catchPokemon(params: {
    userId: number;
    catchPokemonDto: CatchPokemonDto;
  }) {
    const { userId, catchPokemonDto } = params;

    try {
      return await this.pokemonRepository.catchPokemon({
        userId,
        catchPokemonDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          errorMessages.conflict.pokemonAlreadyCaught,
        );
      }

      throw error;
    }
  }
}
