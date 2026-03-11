import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Box, Button, Typography } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6">Pokemon app</Typography>
      <Button
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
        sx={{ mt: 1 }}
      >
        Log out
      </Button>
    </Box>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
