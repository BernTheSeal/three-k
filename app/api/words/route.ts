import { withResponse, withAuth, withValidate } from "@/hoc";
import { wordService } from "@/services/word";
import { wordsGetSchema } from "@/schemas/validators/word";

export const GET = withResponse(
  withAuth(
    withValidate(wordsGetSchema, async (req, context) => {
      const filters = context.validatedData.query;
      const response = await wordService.getAll(filters);
      const { words, paginate, totalCount } = response;
      return {
        message: "words successfully fetched!",
        data: {
          paginate,
          totalCount,
          words,
        },
      };
    }),
  ),
  { rateLimitType: "default" },
);
