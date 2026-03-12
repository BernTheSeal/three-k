"use client";

import { useAuth } from "@/context/authProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

import axios from "axios";

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [reqLoading, setReqLoading] = useState<boolean>(false);

  const bodyData = { a: 11, b: "s" };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.push("/");
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    setReqLoading(true);
    try {
      const res = await axios.post("/api/test/");

      console.log("SUCCESS =>", res.data);
    } catch (error: any) {
      const errorData = error.response?.data;
      console.log("ERROR =>", errorData);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 h-24 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl border-4 border-white flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-sm">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-red-100 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={sendRequest}
            className="w-full bg-green-400 text-white p-2 mt-4 rounded-xl cursor-pointer"
          >
            <span className="text-xs font-medium  uppercase tracking-wider">
              {reqLoading ? "loading..." : "post"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
