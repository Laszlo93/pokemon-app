import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { RhfTextField } from "../components/hook-form/RhfTextField";
import { AuthLayout } from "../components/layout/AuthLayout";
import { register as registerApi, login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import type { RegisterFormData } from "../types/auth";

export function Register() {
  const navigate = useNavigate();
  const { login: setToken } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = useForm<RegisterFormData>();

  async function onSubmit(values: RegisterFormData) {
    try {
      const { firstName, lastName, email, password } = values;
      await registerApi({ firstName, lastName, email, password });
      const { accessToken } = await loginApi({
        email: values.email,
        password: values.password,
      });
      setToken(accessToken);
      navigate("/", { replace: true });
    } catch {
      setSnackbarMessage("Registration failed");
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
          Register
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <RhfTextField
            control={control}
            name="firstName"
            label="First name"
            rules={{ required: "Required" }}
          />
          <RhfTextField
            control={control}
            name="lastName"
            label="Last name"
            rules={{ required: "Required" }}
          />
        </Box>
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
          rules={{
            required: "Required",
            minLength: { value: 8, message: "At least 8 characters" },
          }}
        />
        <RhfTextField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          rules={{
            required: "Required",
            validate: (v) =>
              v === getValues("password") || "Passwords do not match",
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Already have an account? <Link to="/login">Log in</Link>
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
