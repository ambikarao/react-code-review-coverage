import { User } from "../models/types";

export interface AuthResponse {
  user: User;
  token: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(email: string, password: string): Promise<AuthResponse> {
  await delay(300);
  return {
    user: { id: "1", name: "Demo User", email },
    token: "demo-token",
  };
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  await delay(300);
  return {
    user: { id: "2", name, email },
    token: "demo-token",
  };
}

export function logout(): void {
  // no-op for demo
}


