import { NextResponse, NextRequest } from "next/server";
import { AppError } from "@/errors/AppError";
import { HTTP_STATUS } from "@/constants/httpStatus";

export const withResponse = <R>(
  handler: (
    req: NextRequest,
    ctx: { params: Promise<unknown> },
  ) => Promise<{ responseData: R; statusCode?: number }>,
) => {
  return async (req: NextRequest, context: { params: Promise<unknown> }) => {
    try {
      const { responseData, statusCode } = await handler(req, context);

      return NextResponse.json(
        { success: true, data: responseData },
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

      return NextResponse.json(
        { success: false, message, details, code },
        { status },
      );
    }
  };
};
