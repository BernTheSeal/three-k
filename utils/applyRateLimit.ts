import { NextRequest } from "next/server";
import { defaultLimiter, strictLimiter, looseLimiter } from "@/lib/rateLimit";
import { RateLimitError } from "@/errors";

const limiters = {
  default: defaultLimiter,
  strict: strictLimiter,
  loose: looseLimiter,
};

export type RateLimitType = keyof typeof limiters;

export const applyRateLimit = async (
  req: NextRequest,
  type?: RateLimitType,
) => {
  if (type) {
    const limiter = limiters[type];
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await limiter.limit(ip);

    if (!success) {
      throw new RateLimitError(
        "Too many requests, please try again later.",
        "TOO_MANY_REQUESTS",
      );
    }
  }
};
