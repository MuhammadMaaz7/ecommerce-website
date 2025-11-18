import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setUser(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authAPI.register({ name, email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setUser(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // Note: Toast will be called from the component that triggers logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
