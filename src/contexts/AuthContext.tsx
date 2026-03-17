import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: (token: string) => void;
  logout: () => void;
  setProfileComplete: (complete: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(() =>
    localStorage.getItem("profile_complete") === "true"
  );

  const login = (newToken: string) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("profile_complete");
    setToken(null);
    setIsProfileComplete(false);
  };

  const setProfileComplete = (complete: boolean) => {
    localStorage.setItem("profile_complete", String(complete));
    setIsProfileComplete(complete);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, isProfileComplete, login, logout, setProfileComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
