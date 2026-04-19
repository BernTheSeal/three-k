import { withResponse, withAuth, withValidate } from "@/hoc";

import { wordService } from "@/services/word";

import { wordGetSchema } from "@/schemas/validators/word";

export const GET = withResponse(
  withAuth(
    withValidate(wordGetSchema, async (req, context) => {
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
