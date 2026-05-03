import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(values) {
    const res = await api.post("/auth/login", values);
    localStorage.setItem("feespro_token", res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("feespro_token");
    setAdmin(null);
  }

  const value = useMemo(() => ({ admin, loading, login, logout }), [admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
