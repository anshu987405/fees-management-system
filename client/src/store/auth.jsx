import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX 1
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setAdmin(res.data.user)) // ✅ user not admin
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 FIX 2
  async function login(values) {
    const res = await api.post("/auth/login", values);

    if (res.data.success) {
      setAdmin(res.data.user); // ✅ user not admin
      return res.data.user;
    } else {
      throw new Error(res.data.message);
    }
  }

  // logout
  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    setAdmin(null);
  }

  const value = useMemo(
    () => ({ admin, loading, login, logout }),
    [admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);