"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchHello = async () => {
      try {
        const res = await fetch("/api/hello/");
        const data = await res.json();
        setMsg(data.msg);
      } catch (error) {
        setMsg(":(");
      } finally {
        setLoading(false);
      }
    };

    fetchHello();
  }, []);

  if (loading) return <div>wait</div>;

  return (
    <div className=" bg-gray-800 min-h-screen flex items-center justify-center ">
      <span className="text-6xl">{msg}</span>
    </div>
  );
}
