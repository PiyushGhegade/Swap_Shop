import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { User } from "@/types/user"; // your corrected custom type
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ Extended schema for signup form
export const userFormSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .endsWith("@iitp.ac.in", "Only @iitp.ac.in email addresses are allowed"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: User | null) => void;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

type LoginData = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ✅ Restore session on mount
  useEffect(() => {
    console.log("🟡 Checking session with /api/auth/me...");
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
          if (!res.ok) {
            console.warn("⚠️ Session invalid or expired");
            setUser(null);
          } else {
            const data = await res.json();

            const normalizedUser = {
              ...data.user,
              _id: data.user._id || data.user.id,
            };

            console.log("✅ Restored user from /api/auth/me", normalizedUser); // 🔍 Confirm avatar here
            setUser(normalizedUser);
          }
        })

      .catch((err) => {
        console.error("❌ Session fetch failed", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ✅ Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await res.json();
      return data.user;
    },
    onSuccess: (user: User) => {
      const normalizedUser = {
        ...user,
        _id: user._id || user.id,
      };

      setUser(normalizedUser);
      queryClient.setQueryData(["/api/user"], normalizedUser);

      console.log("💡 Logged-in User:", normalizedUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${normalizedUser.name || "User"}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ✅ Register
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/signup", credentials);
      const data = await res.json();
      return data.user;
    },
    onSuccess: (user: User) => {
      const normalizedUser = {
        ...user,
        _id: user._id || user.id,
      };

      setUser(normalizedUser);
      queryClient.setQueryData(["/api/user"], normalizedUser);

      console.log("🆕 Registered User:", normalizedUser);
      toast({
        title: "Registration successful",
        description: `Welcome to CampusMarket, ${normalizedUser.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ✅ Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["/api/user"], null);
      console.log("👋 User logged out");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setUser,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
