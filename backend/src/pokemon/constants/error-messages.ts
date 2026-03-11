import { commonErrorMessages } from 'src/common/constants/error-messages';

export const errorMessages = {
  ...commonErrorMessages,
  badRequest: {
    validationErrorCatch:
      'Validation error (e.g. invalid or missing pokemonId)',
  },
  conflict: {
    pokemonAlreadyCaught: 'Pokemon already caught by this user',
  },
  notFound: {
    caughtPokemonNotFound: 'Caught pokemon not found for this user',
  },
};
