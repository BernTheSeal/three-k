import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

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
        throw new Error("Session cookie is missing!");
      }

      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

      const userId = decoded.uid;

      return await handler(req, { ...context, userId });
    } catch (error: any) {
      if (error.codePrefix === "auth") {
        throw new Error("unauthenticated! Log in again.");
      }

      throw error;
    }
  };
};
