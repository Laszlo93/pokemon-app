import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { RhfTextField } from "../components/hook-form/RhfTextField";
import { AuthLayout } from "../components/layout/AuthLayout";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import type { LoginPayload } from "../types/auth";

export function Login() {
  const navigate = useNavigate();
  const { login: setToken } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginPayload>();

  async function onSubmit(values: LoginPayload) {
    try {
      const { accessToken } = await loginApi(values);
      setToken(accessToken);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const status = err && typeof err === "object" && "response" in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined;
      setSnackbarMessage(status === 401 ? "Invalid login data" : "Login failed");
    }
  }

  return (
    <AuthLayout>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
      <Typography variant="h5" component="h1">
        Log in
      </Typography>

      <RhfTextField
        control={control}
        name="email"
        label="Email"
        type="email"
        rules={{
          required: "Required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        }}
      />
      <RhfTextField
        control={control}
        name="password"
        label="Password"
        type="password"
        rules={{ required: "Required" }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? "Signing in..." : "Log in"}
      </Button>

      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </Typography>
    </Box>
    <Snackbar
      open={Boolean(snackbarMessage)}
      autoHideDuration={6000}
      onClose={() => setSnackbarMessage(null)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => setSnackbarMessage(null)}
        severity="error"
        variant="outlined"
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </AuthLayout>
  );
}
