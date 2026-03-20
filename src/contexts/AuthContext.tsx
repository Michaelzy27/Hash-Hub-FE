import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  location?: string;
  skills?: string[];
  twitterUsername?: string;
  avatarUrl?: string;
  walletAddress?: string;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  userProfile: User | null;
  login: (token: string, profile?: User) => void;
  logout: () => void;
  setProfileComplete: (complete: boolean) => void;
  setUserProfile: (profile: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(() =>
    localStorage.getItem("profile_complete") === "true"
  );
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("user_profile");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken: string, profile?: UserProfile) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
      setUserProfileState(profile);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("profile_complete");
    localStorage.removeItem("user_profile");
    setToken(null);
    setIsProfileComplete(false);
    setUserProfileState(null);
  };

  const setProfileComplete = (complete: boolean) => {
    localStorage.setItem("profile_complete", String(complete));
    setIsProfileComplete(complete);
  };

  const setUserProfile = (profile: UserProfile) => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    setUserProfileState(profile);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, isProfileComplete, userProfile, login, logout, setProfileComplete, setUserProfile }}
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
