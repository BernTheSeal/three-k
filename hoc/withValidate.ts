import z from "zod";
import { NextRequest } from "next/server";
import { ValidateError } from "@/errors";

export const withValidate = <R, C extends { params: Promise<unknown> }, T>(
  schema: z.ZodType<T>,
  handler: (
    req: NextRequest,
    context: C & { validatedData: T },
  ) => Promise<{ data: R; statusCode?: number; message: string }>,
) => {
  return async (req: NextRequest, context: C) => {
    try {
      const rawBody = await req.json().catch(() => undefined);
      const body = rawBody && Object.keys(rawBody).length > 0 ? rawBody : {};

      const { searchParams } = new URL(req.url);

      const query: Record<string, unknown> = {};
      searchParams.forEach((value, key) => {
        if (Object.hasOwn(query, key)) {
          if (Array.isArray(query[key])) {
            query[key].push(value);
          } else {
            query[key] = [query[key], value];
          }
        } else {
          query[key] = value;
        }
      });

      const myParams = await context.params;
      const resolvedParams =
        myParams && Object.keys(myParams).length > 0 ? myParams : {};

      const requestData = {
        body,
        query,
        params: resolvedParams,
      };

      const validatedData = schema.parse(requestData);

      return await handler(req, { ...context, validatedData });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = err.issues.map((issue) => {
          return {
            message: issue.message,
            path: issue.path.slice(1).join("."),
            location: issue.path[0] as "body" | "query" | "params",
          };
        });

        throw new ValidateError(
          "Some fields are invalid!",
          "VALIDATE_ERROR",
          formattedErrors,
        );
      }
      throw err;
    }
  };
};
