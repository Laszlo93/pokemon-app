import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { getPokemonById } from "../api/pokeApi";
import {
  getCaughtPokemons,
  catchPokemon,
  releasePokemon,
} from "../api/pokemons";
import type { PokemonDetail } from "../types/pokemon";
import { capitalize, POKEMON_IMAGE_URL } from "../utils/pokemon";

const MAX_STAT = 255;

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [caughtIds, setCaughtIds] = useState<Set<number>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadCaughtIds = useCallback(async () => {
    try {
      const list = await getCaughtPokemons();
      setCaughtIds(new Set(list.map((c) => c.pokemonId)));
    } catch (err) {
      console.error("Failed to load caught pokemons", err);

      setCaughtIds(new Set());
    }
  }, []);

  useEffect(() => {
    loadCaughtIds();
  }, [loadCaughtIds]);

  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (!id || Number.isNaN(numId) || numId < 1) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    (async () => {
      try {
        const data = await getPokemonById(numId);
        setPokemon(data);
      } catch (err) {
        console.error("Failed to load pokemon detail", err);
        setError(true);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCatch = useCallback(async () => {
    if (!pokemon || actionLoading) return;

    setActionLoading(true);

    try {
      await catchPokemon({
        pokemonId: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
      });
      loadCaughtIds();
    } catch (err) {
      console.error("Failed to catch pokemon", err);
    }

    setActionLoading(false);
  }, [pokemon, actionLoading, loadCaughtIds]);

  const handleRelease = useCallback(async () => {
    if (!pokemon || actionLoading) return;

    setActionLoading(true);

    try {
      await releasePokemon(pokemon.id);
      loadCaughtIds();
    } catch (err) {
      console.error("Failed to release pokemon", err);
    }

    setActionLoading(false);
  }, [pokemon, actionLoading, loadCaughtIds]);

  const isCaught = pokemon ? caughtIds.has(pokemon.id) : false;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !pokemon) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
              Pokemon app
            </Typography>
            <Button color="inherit" onClick={() => navigate("/")}>
              List
            </Button>
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
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography color="error">Pokémon not found.</Typography>

          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            List
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            {capitalize(pokemon.name)}
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            List
          </Button>
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

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720, mx: "auto" }}>
        <Card variant="outlined" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              background:
                "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
              py: 3,
              px: 2,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src={POKEMON_IMAGE_URL(pokemon.id)}
              alt={pokemon.name}
              sx={{
                width: 200,
                height: 200,
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
              }}
            />
            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: 700, mt: 1 }}
            >
              {capitalize(pokemon.name)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}
            >
              #{String(pokemon.id).padStart(3, "0")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                flexWrap: "wrap",
                mt: 1.5,
              }}
            >
              {pokemon.types.map((t) => (
                <Paper
                  key={t}
                  variant="outlined"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {capitalize(t)}
                </Paper>
              ))}
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Size
                </Typography>
                <Typography variant="body1">
                  Height: <strong>{pokemon.height / 10} m</strong>
                </Typography>
                <Typography variant="body1">
                  Weight: <strong>{pokemon.weight / 10} kg</strong>
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Abilities
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {pokemon.abilities
                    .filter((a) => !a.isHidden)
                    .map((a) => (
                      <li key={a.name}>
                        <Typography variant="body2">
                          {capitalize(a.name)}
                        </Typography>
                      </li>
                    ))}
                  {pokemon.abilities.filter((a) => !a.isHidden).length === 0 && (
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    </li>
                  )}
                </Box>
              </Paper>
            </Box>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 3, mb: 1 }}
            >
              Base stats
            </Typography>
            <Table size="small">
              <TableBody>
                {pokemon.stats.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell
                      sx={{ textTransform: "capitalize", fontWeight: 500 }}
                    >
                      {s.name}
                    </TableCell>
                    <TableCell align="right" width={60}>
                      {s.value}
                    </TableCell>
                    <TableCell padding="none" sx={{ width: "50%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (s.value / MAX_STAT) * 100)}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 1,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              {isCaught ? (
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleRelease}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Releasing…" : "Release"}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCatch}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Catching…" : "Catch"}
                </Button>
              )}
              <Button variant="outlined" onClick={() => navigate("/")}>
                Back to list
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
