import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { getTypes, getPokemonsByType } from "../api/pokeApi";
import type { PokeType } from "../types/pokemon";
import type { PokemonListItem } from "../types/pokemon";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

const POKEMON_IMAGE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export function PokemonList() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [types, setTypes] = useState<PokeType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [searchText, setSearchText] = useState("");
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingList, setLoadingList] = useState(false);

  const loadTypes = useCallback(async () => {
    setLoadingTypes(true);
    try {
      const list = await getTypes();
      setTypes(list);
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  useEffect(() => {
    if (selectedTypeId === "") {
      setPokemonList([]);
      setLoadingList(false);
      return;
    }
    setLoadingList(true);
    getPokemonsByType(selectedTypeId as number)
      .then(setPokemonList)
      .finally(() => setLoadingList(false));
  }, [selectedTypeId]);

  const displayList = pokemonList.filter((p) =>
    searchText
      ? p.name.toLowerCase().includes(searchText.toLowerCase())
      : true
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Pokemon app
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          {loadingTypes ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Loading types…
              </Typography>
            </Box>
          ) : (
            <>
              <Select
                size="small"
                displayEmpty
                value={selectedTypeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTypeId(
                    typeof val === "string" && val === "" ? "" : Number(val)
                  );
                }}
                sx={{ minWidth: 160 }}
                renderValue={(v) =>
                  (typeof v === "string" && v === "") || v === undefined
                    ? "Select type"
                    : capitalize(types.find((t) => t.id === Number(v))?.name ?? "")
                }
              >
                <MenuItem value="">Select type</MenuItem>
                {types.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {capitalize(t.name)}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                size="small"
                placeholder="Search by name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </>
          )}
        </Box>

        {loadingList && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!loadingList && (
          <>
            {displayList.length === 0 && (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                {selectedTypeId === ""
                  ? "Select a type to see pokemons."
                  : "No matching pokemons."}
              </Typography>
            )}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1,
              }}
            >
              {displayList.map((p) => (
                <Card key={p.id} variant="outlined" sx={{ textAlign: "center" }}>
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box
                      component="img"
                      src={POKEMON_IMAGE_URL(p.id)}
                      alt={p.name}
                      sx={{
                        width: 72,
                        height: 72,
                        objectFit: "contain",
                        display: "block",
                        mx: "auto",
                        mb: 0.5,
                      }}
                    />
                    <Typography variant="body2">
                      {capitalize(p.name)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
