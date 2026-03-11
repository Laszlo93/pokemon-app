import axios from "axios";
import type {
  PokeApiPokemonResponse,
  PokeApiTypeDetailResponse,
  PokeApiTypesListResponse,
  PokeType,
  PokemonDetail,
  PokemonListItem,
} from "../types/pokemon";

const pokeApiClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  headers: { "Content-Type": "application/json" },
});

function getIdFromUrl(url: string): number {
  const segment = url.replace(/\/$/, "").split("/").pop();
  return parseInt(segment ?? "0", 10);
}

export async function getTypes(): Promise<PokeType[]> {
  const { data } = await pokeApiClient.get<PokeApiTypesListResponse>("/type/");

  return data.results.map((t) => ({
    id: getIdFromUrl(t.url),
    name: t.name,
  }));
}

export async function getAllPokemons(limit = 500): Promise<PokemonListItem[]> {
  const { data } = await pokeApiClient.get<PokeApiTypesListResponse>(
    "/pokemon",
    { params: { limit } }
  );

  return data.results.map((r) => ({
    id: getIdFromUrl(r.url),
    name: r.name,
  }));
}

export async function getPokemonsByType(
  typeId: number
): Promise<PokemonListItem[]> {
  const { data } = await pokeApiClient.get<PokeApiTypeDetailResponse>(
    `/type/${typeId}/`
  );

  return data.pokemon.map(({ pokemon }) => ({
    id: getIdFromUrl(pokemon.url),
    name: pokemon.name,
  }));
}

export async function getPokemonById(id: number): Promise<PokemonDetail> {
  const { data } = await pokeApiClient.get<PokeApiPokemonResponse>(
    `/pokemon/${id}`
  );

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t) => t.type.name),
    height: data.height,
    weight: data.weight,
    stats: data.stats.map((s) => ({
      name: s.stat.name.replace(/-/g, " "),
      value: s.base_stat,
    })),
    abilities: data.abilities.map((a) => ({
      name: a.ability.name.replace(/-/g, " "),
      isHidden: a.is_hidden,
    })),
  };
}
