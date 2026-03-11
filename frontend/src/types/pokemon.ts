export type PokeType = {
  id: number;
  name: string;
};

export type PokemonListItem = {
  id: number;
  name: string;
};

export type PokemonDetail = {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: Array<{ name: string; value: number }>;
  abilities: Array<{ name: string; isHidden: boolean }>;
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

export type PokeApiPokemonResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
};
