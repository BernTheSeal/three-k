import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

const expiresIn = 60 * 60 * 24 * 3 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    await adminAuth.verifyIdToken(idToken, true);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresIn,
    });

    const res = NextResponse.json(
      { status: "session-created" },
      { status: 200 },
    );

    res.cookies.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return res;
  } catch (err) {
    console.error("SESSION POST ERROR:", err);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    const res = NextResponse.json({
      status: "no-session",
    });

    res.cookies.set({
      name: "session",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return res;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const uid = decoded.uid;

    await adminAuth.revokeRefreshTokens(uid);
  } catch (err) {
    console.warn("Session verify failed:", err);
  }

  const res = NextResponse.json({
    status: "logged-out",
  });

  res.cookies.set({
    name: "session",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return res;
}
