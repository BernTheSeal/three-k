import { withResponse, withAuth, withValidate } from "@/hoc";
import { userWordPatchSchema, userWordDeleteSchema } from "@/schemas/userWord";
import { userWordService } from "@/services/userWord";

export const PATCH = withResponse(
  withAuth(
    withValidate(userWordPatchSchema, async (req, context) => {
      const data = context.validatedData.body;
      const word_id = context.validatedData.params.word_id;
      const user_id = context.user_id;

      const updatedRow = await userWordService.update(user_id, word_id, data);

      return {
        data: updatedRow,
        message: "Word is successfully updated!",
      };
    }),
  ),
);

export const DELETE = withResponse(
  withAuth(
    withValidate(userWordDeleteSchema, async (req, context) => {
      const user_id = context.user_id;
      const word_id = context.validatedData.params.word_id;

      const deletedWord = await userWordService.delete(user_id, word_id);

      return {
        message: "word is successfully deleted!",
        data: deletedWord,
      };
    }),
  ),
);
