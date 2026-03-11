import { apiClient } from "./client";

export type CaughtPokemon = {
  userId: number;
  id: number;
  pokemonId: number;
  name: string;
  types: string[];
  caughtAt: string;
};

export async function getCaughtPokemons(params?: {
  name?: string;
  type?: string;
}): Promise<CaughtPokemon[]> {
  const { data } = await apiClient.get<CaughtPokemon[]>("/pokemons", {
    params,
  });
  return data;
}

export async function catchPokemon(body: {
  pokemonId: number;
  name: string;
  types: string[];
}): Promise<CaughtPokemon> {
  const { data } = await apiClient.post<CaughtPokemon>("/pokemons", body);
  return data;
}

export async function releasePokemon(pokemonId: number): Promise<void> {
  await apiClient.delete(`/pokemons/${pokemonId}`);
}
