import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  userId: string;
  role: "mentor" | "student";
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(jwtDecode<User>(token));
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser(jwtDecode<User>(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
