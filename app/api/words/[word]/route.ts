import { withResponse, withAuth, withValidate } from "@/hoc";
import z from "zod";

import wordServie from "@/services/word";

const getWordSchema = z.object({
  params: z.object({
    word: z.string(),
  }),
});

export const GET = withResponse(
  withAuth(
    withValidate(getWordSchema, async (req, context) => {
      const { word } = context.validatedData.params;
      const result = await wordServie.getWordWithLibrary(word);
      return {
        data: result,
      };
    }),
  ),
  { rateLimitType: "loose" },
);
