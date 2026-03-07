"use client";

import {
  onAuthStateChanged,
  User,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);

      await syncSession(currentUser);

      setLoading(false);
    });

    return unsub;
  }, []);

  const syncSession = async (user: User | null) => {
    if (user) {
      const idToken = await user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
    } else {
      await fetch("/api/session", { method: "DELETE" });
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await syncSession(userCredential.user);
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await syncSession(userCredential.user);
  };

  const logout = async () => {
    await syncSession(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
