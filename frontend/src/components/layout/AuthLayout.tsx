import { Box } from "@mui/material";
import pokemonsImage from "../../assets/pokemons.png";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flex: { xs: "0 0 auto", md: "0 0 38%" },
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 220, md: "100vh" },
          p: 2,
          bgcolor: "grey.300",
        }}
      >
        <Box
          component="img"
          src={pokemonsImage}
          alt="Pokemon"
          sx={{
            maxWidth: "100%",
            maxHeight: { xs: 220, md: "70vh" },
            objectFit: "contain",
          }}
        />
      </Box>
      <Box
        sx={{
          flex: { xs: "1 1 auto", md: "1 1 62%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
