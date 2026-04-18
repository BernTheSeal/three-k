import { NextResponse, NextRequest } from "next/server";
import { AppError } from "@/errors/AppError";

import { applyRateLimit, RateLimitType } from "../utils/applyRateLimit";
import { DatabaseError } from "pg";

const dbErrorMapper: Record<
  string,
  { status: number; message: string; code: string }
> = {
  fk_user_words_word: {
    status: 404,
    message: "Word not found",
    code: "WORD_NOT_FOUND",
  },
  pk_user_words: {
    status: 409,
    message: "Word already saved",
    code: "WORD_ALREADY_SAVED",
  },
  fk_user_words_user: {
    status: 404,
    message: "User not found",
    code: "USER_NOT_FOUND",
  },
};

export const withResponse = <R>(
  handler: (
    req: NextRequest,
    ctx: { params: Promise<unknown> },
  ) => Promise<{ data: R; statusCode?: number; message: string }>,
  options?: { rateLimitType: RateLimitType },
) => {
  return async (req: NextRequest, context: { params: Promise<unknown> }) => {
    try {
      await applyRateLimit(req, options?.rateLimitType);

      const { data, statusCode, message } = await handler(req, context);

      return NextResponse.json(
        { success: true, data: data, message },
        { status: statusCode ?? 200 },
      );
    } catch (err: any) {
      console.error("ERROR =>", err);

      let message = "Internal Server Error";
      let status = 500;
      let details: unknown[] = [];
      let code = "UNKNOWN_ERROR";

      if (err instanceof AppError && err.isOperational) {
        message = err.message;
        status = err.statusCode;
        details = err.details;
        code = err.code;
      }

      if (err instanceof DatabaseError) {
        if (err.constraint && dbErrorMapper[err.constraint]) {
          const res = dbErrorMapper[err.constraint];
          message = res.message;
          status = res.status;
          code = res.code;
        } else {
          console.warn("Unmapped DB error:", err.constraint, err.message);
        }
      }
      return NextResponse.json(
        { success: false, message, details, code },
        { status },
      );
    }
  };
};
