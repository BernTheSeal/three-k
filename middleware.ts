import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  console.log("SESSION MIDDLEWARE", session);
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/library"];

  const authRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
