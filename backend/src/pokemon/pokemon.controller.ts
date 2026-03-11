import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';
import { CaughtPokemonResponseDto } from './dto/caught-pokemon.response.dto';
import { RequestWithUser } from 'src/auth/types/types';
import { errorMessages } from './constants/error-messages';

const PATHS = {
  basePath: 'pokemons',
  release: ':pokemonId',
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

  @Delete(PATHS.release)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Pokemon released successfully',
  })
  @ApiNotFoundResponse({
    description: errorMessages.notFound.caughtPokemonNotFound,
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  async releasePokemon(
    @Request() req: RequestWithUser,
    @Param('pokemonId', ParseIntPipe) pokemonId: number,
  ): Promise<void> {
    const { userId } = req.user;

    return this.pokemonService.releasePokemon({ userId, pokemonId });
  }
}
