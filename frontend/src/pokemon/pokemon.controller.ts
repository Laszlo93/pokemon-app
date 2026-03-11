import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';
import { CaughtPokemonResponseDto } from './dto/caught-pokemon.response.dto';
import { RequestWithUser } from 'src/auth/types/types';
import { errorMessages } from './constants/error-messages';

const PATHS = {
  basePath: 'pokemons',
};

@Controller(PATHS.basePath)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Pokemon caught successfully',
    type: CaughtPokemonResponseDto,
  })
  @ApiBadRequestResponse({
    description: errorMessages.badRequest.validationErrorCatch,
  })
  @ApiConflictResponse({
    description: errorMessages.conflict.pokemonAlreadyCaught,
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  catchPokemon(
    @Request() req: RequestWithUser,
    @Body() catchPokemonDto: CatchPokemonDto,
  ) {
    const { userId } = req.user;

    return this.pokemonService.catchPokemon({ userId, catchPokemonDto });
  }
}
