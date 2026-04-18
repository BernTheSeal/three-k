import { withResponse, withAuth, withValidate } from "@/hoc";
import z from "zod";

import { wordService } from "@/services/word";

const getWordSchema = z.object({
  params: z.object({
    word: z.string(),
  }),
});

export const GET = withResponse(
  withAuth(
    withValidate(getWordSchema, async (req, context) => {
      const { word } = context.validatedData.params;
      const user_id = context.user_id;

      const data = await wordService.getWordWithLibrary(user_id, word);
      return {
        message: `${data.word}'s informations successfully fetched!`,
        data,
      };
    }),
  ),
  { rateLimitType: "loose" },
);
