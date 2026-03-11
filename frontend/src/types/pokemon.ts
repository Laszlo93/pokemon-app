export type PokeType = {
  id: number;
  name: string;
};

export type PokemonListItem = {
  id: number;
  name: string;
};

export type PokeApiNamedRef = {
  name: string;
  url: string;
};

export type PokeApiTypesListResponse = {
  results: PokeApiNamedRef[];
};

export type PokeApiTypeDetailResponse = {
  pokemon: Array<{ pokemon: PokeApiNamedRef }>;
};
