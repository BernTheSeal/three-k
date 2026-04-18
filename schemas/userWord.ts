import z from "zod";

const userWordBaseSchema = z.object({
  word_id: z
    .number("Word ID must be a number!")
    .int("Word ID must be an integer!")
    .positive("Word ID must be a positive number!"),
  note: z
    .string("Note must be a string or null!")
    .nullable()
    .transform((val) => val?.trim() || null),

  status: z.enum(
    ["learning", "known"],
    "Status can include learning or known!",
  ),
  is_favorite: z.boolean("Is_favorite must be a boolean!"),
});

type UserWordEntity = z.infer<typeof userWordBaseSchema> & {
  created_at: Date;
  updated_at: Date;
};

export const userWordsPostSchema = z.object({
  body: userWordBaseSchema.strict(),
});
export const userWordGetSchema = z.object({
  query: userWordBaseSchema
    .omit({ word_id: true, note: true })
    .extend({
      offset: z
        .string()
        .optional()
        .default("0")
        .transform((val) => Number(val))
        .pipe(
          z
            .number("Offset must be a number!")
            .min(0, "Offset must be at least 0"),
        ),
      search: z.string().optional(),
      is_favorite: z
        .enum(["true", "false"], "Is_favorite must be true or false!")
        .optional()
        .transform((val) =>
          val === "true" ? true : val === "false" ? false : undefined,
        ),
    })
    .partial({ status: true, is_favorite: true })
    .strict(),
});
export const userWordPatchSchema = z.object({
  body: userWordBaseSchema.omit({ word_id: true }).partial(),
  params: z.object({
    word_id: z.coerce
      .number("Word_id must be a number")
      .int("Word_id must be an integer!")
      .positive("Word_id must be a postive number!"),
  }),
});
export const userWordDeleteSchema = z.object({
  params: z.object({
    word_id: z.coerce
      .number("Word_id must be a number")
      .int("Word_id must be an integer!")
      .positive("Word_id must be a postive number!"),
  }),
});

export type CreateUserWordInput = z.infer<typeof userWordsPostSchema>["body"];
export type GetUserWordInput = z.infer<typeof userWordGetSchema>["query"];
export type UpdateUserWordInput = z.infer<typeof userWordPatchSchema>["body"];

export type GetByUserIdAndWordId = UserWordEntity;
export type GetByUserId = Omit<UserWordEntity, "note" | "created_at"> & {
  word: string;
  total_words: number;
};
