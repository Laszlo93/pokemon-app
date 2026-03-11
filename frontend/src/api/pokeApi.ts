import axios from "axios";
import type {
  PokeApiTypeDetailResponse,
  PokeApiTypesListResponse,
  PokeType,
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
