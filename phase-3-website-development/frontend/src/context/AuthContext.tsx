import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, login as apiLogin, register as apiRegister, type RegisterPayload } from "../modules/auth/api";
import { getAuthToken, setAuthToken } from "../shared/api";

type UserRole = "patient" | "doctor" | "admin";

export type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
  doctorId: number | null;
};

type AuthState = {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((u) => setUser({ id: u.id, name: u.name, role: u.role, doctorId: u.doctorId }))
      .catch(() => {
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(email: string, password: string) {
    const result = await apiLogin(email, password);
    setAuthToken(result.token);
    const u: CurrentUser = {
      id: result.user.id,
      name: result.user.name,
      role: result.user.role,
      doctorId: result.user.doctorId,
    };
    setUser(u);
    return u;
  }

  async function handleRegister(payload: RegisterPayload) {
    const result = await apiRegister(payload);
    return result.message;
  }

  function handleLogout() {
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
