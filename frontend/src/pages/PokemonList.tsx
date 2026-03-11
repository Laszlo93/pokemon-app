import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { getTypes, getPokemonsByType, getAllPokemons } from "../api/pokeApi";
import { getCaughtPokemons, releasePokemon } from "../api/pokemons";
import type { PokeType, PokemonListItem } from "../types/pokemon";
import { capitalize, POKEMON_IMAGE_URL } from "../utils/pokemon";

export function PokemonList() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [types, setTypes] = useState<PokeType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "" | "all">("");
  const [searchText, setSearchText] = useState("");
  const [onlyCaught, setOnlyCaught] = useState(false);
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc">("name-asc");
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [caughtIds, setCaughtIds] = useState<Set<number>>(new Set());
  const [caughtList, setCaughtList] = useState<PokemonListItem[]>([]);
  const [releasingId, setReleasingId] = useState<number | null>(null);

  const loadCaughtIds = useCallback(async () => {
    try {
      const list = await getCaughtPokemons();
      setCaughtIds(new Set(list.map((c) => c.pokemonId)));
      setCaughtList(list.map((c) => ({ id: c.pokemonId, name: c.name })));
    } catch (err) {
      console.error("Failed to load caught pokemons", err);

      setCaughtIds(new Set());
      setCaughtList([]);
    }
  }, []);

  useEffect(() => {
    loadCaughtIds();
  }, [loadCaughtIds]);

  const handleRelease = useCallback(
    async (e: React.MouseEvent, pokemonId: number) => {
      e.stopPropagation();
      if (releasingId !== null) return;
      setReleasingId(pokemonId);
      try {
        await releasePokemon(pokemonId);
        loadCaughtIds();
      } catch (err) {
        console.error("Failed to release pokemon", err);
      } finally {
        setReleasingId(null);
      }
    },
    [releasingId, loadCaughtIds]
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => setLoadingTypes(true));

    getTypes()
      .then((list) => {
        if (!cancelled) setTypes(list);
      })
      .catch((err) => {
        console.error("Failed to load types", err);
      })
      .finally(() => {
        if (!cancelled) setLoadingTypes(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedTypeId === "") return;

    let cancelled = false;

    queueMicrotask(() => setLoadingList(true));

    const promise =
      selectedTypeId === "all"
        ? getAllPokemons(500)
        : getPokemonsByType(selectedTypeId as number);

    promise
      .then((list) => {
        if (!cancelled) setPokemonList(list);
      })
      .catch((err) => {
        console.error(
          selectedTypeId === "all"
            ? "Failed to load all pokemons"
            : "Failed to load pokemons by type",
          err
        );
        if (!cancelled) setPokemonList([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTypeId]);

  const displayList =
    selectedTypeId === ""
      ? []
      : (selectedTypeId === "all" && onlyCaught
          ? caughtList
          : pokemonList.filter((p) => {
              if (onlyCaught && !caughtIds.has(p.id)) return false;
              return true;
            })
        )
          .filter((p) => {
            if (
              searchText &&
              !p.name.toLowerCase().includes(searchText.toLowerCase())
            )
              return false;
            return true;
          })
          .sort((a, b) => {
            const cmp = a.name.localeCompare(b.name, undefined, {
              sensitivity: "base",
            });
            return sortBy === "name-asc" ? cmp : -cmp;
          });

  const showListLoading =
    selectedTypeId !== "" &&
    loadingList &&
    !(selectedTypeId === "all" && onlyCaught);

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
                  const val = e.target.value as string;
                  if (val === "all") {
                    setSelectedTypeId("all");
                  } else if (val === "") {
                    setSelectedTypeId("");
                  } else {
                    setSelectedTypeId(Number(val));
                  }
                }}
                sx={{ minWidth: 160 }}
                renderValue={(v) => {
                  const value = v as number | "" | "all";
                  if (value === "") return "Select type";
                  if (value === "all") return "All";
                  return capitalize(types.find((t) => t.id === value)?.name ?? "");
                }}
              >
                <MenuItem value="">Select type</MenuItem>
                <MenuItem value="all">All</MenuItem>
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
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name-asc" | "name-desc")}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="name-asc">Name (asc)</MenuItem>
                <MenuItem value="name-desc">Name (desc)</MenuItem>
              </Select>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 40,
                  px: 1,
                  py: 0,
                  border: 1,
                  borderColor: onlyCaught ? "primary.main" : "divider",
                  borderRadius: 1.5,
                  bgcolor: onlyCaught ? "primary.main" : "action.hover",
                  "&:hover": {
                    bgcolor: onlyCaught ? "primary.dark" : "action.selected",
                  },
                }}
              >
                <Checkbox
                  checked={onlyCaught}
                  onChange={(e) => setOnlyCaught(e.target.checked)}
                  size="small"
                  sx={{
                    color: onlyCaught ? "primary.contrastText" : "text.secondary",
                    p: 0.5,
                    "&.Mui-checked": {
                      color: "primary.contrastText",
                    },
                  }}
                />
                <Typography
                  component="span"
                  variant="body2"
                  onClick={() => setOnlyCaught((v) => !v)}
                  sx={{
                    pr: 1,
                    cursor: "pointer",
                    color: onlyCaught ? "primary.contrastText" : "text.primary",
                    fontWeight: 500,
                    userSelect: "none",
                  }}
                >
                  Only caught
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {showListLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!showListLoading && (
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
              {displayList.map((p) => {
                const isCaught = caughtIds.has(p.id);
                return (
                  <Card
                    key={p.id}
                    variant="outlined"
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      borderWidth: isCaught ? 2 : 1,
                      borderColor: isCaught ? "success.main" : "divider",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => navigate(`/pokemon/${p.id}`)}
                  >
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
                      {isCaught && !onlyCaught && (
                        <Chip
                          label="Caught"
                          size="small"
                          color="success"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                      {isCaught && onlyCaught && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                          disabled={releasingId === p.id}
                          onClick={(e) => handleRelease(e, p.id)}
                        >
                          {releasingId === p.id ? "Releasing…" : "Release"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
