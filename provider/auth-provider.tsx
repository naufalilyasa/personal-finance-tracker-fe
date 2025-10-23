/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  User,
  UserLoginResponse,
  UserMeResponse,
  UserRegisterResponse,
} from "@/types/auth-types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiFetch<UserMeResponse>("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch<UserLoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.data.token);

      const userData = await apiFetch<UserMeResponse>("/auth/me", {
        headers: { Authorization: `Bearer ${data.data.token}` },
      });

      setUser(userData.data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiFetch<UserRegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
