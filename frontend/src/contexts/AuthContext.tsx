import {
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "../utils/authStorage";
import { AuthContext, type AuthContextValue } from "./authContextRef";

function subscribe(callback: () => void) {
  window.addEventListener("auth-change", callback);
  return () => window.removeEventListener("auth-change", callback);
}
function getSnapshot() {
  return getStoredToken();
}
function getServerSnapshot() {
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isAuthenticated = Boolean(token);

  const value: AuthContextValue = {
    isAuthenticated,
    login(newToken: string) {
      setStoredToken(newToken);
      window.dispatchEvent(new Event("auth-change"));
    },
    logout() {
      clearStoredToken();
      window.dispatchEvent(new Event("auth-change"));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
