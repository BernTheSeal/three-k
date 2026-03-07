"use client";

import { useAuth } from "@/context/authProvider";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 h-32 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold tracking-tight">App</h1>
        </div>

        <div className="py-10 px-8 text-center">
          {user ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Welcome Back!
                </h2>
                <p className="text-sm text-slate-500 mt-1">some description</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Logged in
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Get Started
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Join our ... platform today.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center py-3 px-4 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Powered by Next.js & PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
}
