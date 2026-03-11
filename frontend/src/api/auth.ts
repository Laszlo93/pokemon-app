import { apiClient } from "./client";
import type {
  RegisterPayload,
  UserResponse,
  LoginPayload,
  LoginResponse,
} from "../types/auth";

export {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "../utils/authStorage";
export type {
  RegisterPayload,
  UserResponse,
  LoginPayload,
  LoginResponse,
} from "../types/auth";

export async function register(
  payload: RegisterPayload
): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>(
    "auth/registerrrr",
    payload
  );

  return data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("auth/login", payload);

  return data;
}
