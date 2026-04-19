import z, { string } from "zod";

import { stringArraySchema, stringSchema } from "../builders";

import { offsetSchema, searchSchema } from "../common";

type WordEntity = {
  word_id: number;
  word: string;
};

type WordPhoneticEntity = {
  locale: "uk" | "us";
  text: string;
  mp3: string;
};

type WordEntryEntity = {
  pos: string;
  level: string;
};

export const wordGetSchema = z.object({
  params: z.object({
    word: stringSchema("word", { min: 1, max: 50 }),
  }),
});

export const wordsGetSchema = z.object({
  query: z
    .object({
      offset: offsetSchema,
      search: searchSchema,
      pos: stringArraySchema("pos", { fromUrl: true }),
      levels: stringArraySchema("levels", { fromUrl: true }),
    })
    .partial()
    .strict(),
});

export type GetWordsInput = z.infer<typeof wordsGetSchema>["query"];

export type GetByWord = WordEntity & WordPhoneticEntity & WordEntryEntity;

export type GetAll = {
  word: string;
  pos: string[];
  levels: string[];
  total_words: number;
};
