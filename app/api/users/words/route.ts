import { withResponse, withAuth, withValidate } from "@/hoc";
import { userWordService } from "@/services/userWord";
import {
  userWordsPostSchema,
  userWordGetSchema,
} from "@/schemas/validators/userWord";

export const GET = withResponse(
  withAuth(
    withValidate(userWordGetSchema, async (req, context) => {
      const filters = context.validatedData.query;
      const userId = context.user_id;
      const response = await userWordService.getUsersWords(userId, filters);
      const { words, paginate, totalCount } = response;
      return {
        message: "Words is successfully fetched!",
        data: {
          paginate,
          totalCount,
          words,
        },
      };
    }),
  ),
);

export const POST = withResponse(
  withAuth(
    withValidate(userWordsPostSchema, async (req, context) => {
      const userId = context.user_id;
      const data = context.validatedData.body;

      await userWordService.create(userId, data);

      return {
        message: "word is successfully created!",
        data: null,
        statusCode: 201,
      };
    }),
  ),
);
