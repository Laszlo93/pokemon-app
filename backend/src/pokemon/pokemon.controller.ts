import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CatchPokemonDto } from './dto/catch-pokemon.dto';
import { CaughtPokemonResponseDto } from './dto/caught-pokemon.response.dto';
import { ListCaughtPokemonsQueryDto } from './dto/list-caught-pokemons.query.dto';
import { RequestWithUser } from 'src/auth/types/types';
import { errorMessages } from './constants/error-messages';

const PATHS = {
  basePath: 'pokemons',
  release: ':pokemonId',
};

@Controller(PATHS.basePath)
@ApiBearerAuth()
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

  @Get()
  @ApiOkResponse({
    description: 'List of caught pokemons for the current user',
    type: [CaughtPokemonResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: errorMessages.internalServerError,
  })
  getCaughtPokemons(
    @Request() req: RequestWithUser,
    @Query() query: ListCaughtPokemonsQueryDto,
  ) {
    const { userId } = req.user;

    return this.pokemonService.getCaughtPokemons({ userId, query });
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
