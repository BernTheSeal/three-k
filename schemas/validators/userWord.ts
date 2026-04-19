import z from "zod";

import {
  booleanSchema,
  numberSchema,
  stringSchema,
  enumSchema,
} from "../builders";

import { offsetSchema, searchSchema } from "../common";

const userWordBaseSchema = z.object({
  word_id: numberSchema("word_id", { int: true, positive: true }),
  note: stringSchema("note", { max: 300, emptyToNull: true }),
  is_favorite: booleanSchema("is_favorite"),
  status: enumSchema("status", ["learning", "known"]),
});

const stringWordId = numberSchema("word_id", {
  fromString: true,
  positive: true,
  int: true,
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
      offset: offsetSchema,
      search: searchSchema,
      is_favorite: booleanSchema("is_favorite", { fromString: true }),
    })
    .partial()
    .strict(),
});

export const userWordPatchSchema = z.object({
  body: userWordBaseSchema.omit({ word_id: true }).partial().strict(),
  params: z
    .object({
      word_id: stringWordId,
    })
    .strict(),
});
export const userWordDeleteSchema = z.object({
  params: z
    .object({
      word_id: stringWordId,
    })
    .strict(),
});

export type CreateUserWordInput = z.infer<typeof userWordsPostSchema>["body"];
export type GetUserWordInput = z.infer<typeof userWordGetSchema>["query"];
export type UpdateUserWordInput = z.infer<typeof userWordPatchSchema>["body"];

export type GetByUserIdAndWordId = UserWordEntity;
export type GetByUserId = Omit<UserWordEntity, "note" | "created_at"> & {
  word: string;
  total_words: number;
};
