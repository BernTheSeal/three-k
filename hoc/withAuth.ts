import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { UnauthorizedError } from "@/errors";

export const withAuth = <R, C extends { params: Promise<unknown> }>(
  handler: (
    req: NextRequest,
    context: C & { userId: string },
  ) => Promise<{ responseData: R; statusCode?: number }>,
) => {
  return async (req: NextRequest, context: C) => {
    try {
      const sessionCookie = req.cookies.get("session")?.value;

      if (!sessionCookie) {
        throw new UnauthorizedError(
          "Cookie is missing! Please login and try again!",
          "COOKIE_IS_NOT_FOUND",
        );
      }

      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

      const userId = decoded.uid;

      return await handler(req, { ...context, userId });
    } catch (err: any) {
      switch (err.code) {
        case "auth/argument-error":
          throw new UnauthorizedError(
            "Session cookie is in invalid format",
            "COOKIE_INVALID",
          );
        case "auth/invalid-session-cookie":
          throw new UnauthorizedError(
            "Session cookie is invalid or expired",
            "SESSION_INVALID",
          );
        case "auth/session-cookie-revoked":
          throw new UnauthorizedError(
            "Session cookie has been revoked, please login again",
            "SESSION_REVOKED",
          );

        default:
          throw err;
      }
    }
  };
};
