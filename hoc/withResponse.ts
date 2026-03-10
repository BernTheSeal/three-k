import { NextResponse, NextRequest } from "next/server";

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
    } catch (error) {
      let message = "Something went wrong!";
      let status = 500;

      if (error instanceof Error) {
        message = error.message;
      }

      return NextResponse.json({ success: false, message }, { status });
    }
  };
};
