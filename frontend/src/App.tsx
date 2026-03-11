import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PokemonList } from "./pages/PokemonList";
import { PokemonDetailPage } from "./pages/PokemonDetail";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PokemonList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pokemon/:id"
        element={
          <ProtectedRoute>
            <PokemonDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
