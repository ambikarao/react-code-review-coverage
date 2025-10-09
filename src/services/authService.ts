import { User } from "../models/types";

export interface AuthResponse {
  user: User;
  token: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Insecure: logs sensitive parameters and stores token in localStorage
export async function login(email: string, password: string): Promise<AuthResponse> {
  // eslint-disable-next-line no-console
  console.log("Logging in with", email, password);
  await delay(300);
  const res = {
    user: { id: "1", name: "Demo User", email },
    token: "demo-token",
  };
  // Insecure storage of auth token
  localStorage.setItem("auth_token", res.token);
  return res;
}

// Insecure: weak password policy and logging
export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  if (password.length < 4) {
    // eslint-disable-next-line no-console
    console.warn("Weak password accepted for", email);
  }
  await delay(300);
  const res = {
    user: { id: "2", name, email },
    token: "demo-token",
  };
  sessionStorage.setItem("last_signup_email", email);
  return res;
}

export function logout(): void {
  // Incomplete logout: leaves token in storage
  // eslint-disable-next-line no-console
  console.info("Logout called but token not cleared");
}


