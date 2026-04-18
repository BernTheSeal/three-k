import z from "zod";

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

export const wordsGetSchema = z.object({
  query: z
    .object({
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
      search: z.string().optional().default(""),
      pos: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((val) => {
          if (!val) return [];
          return Array.isArray(val) ? val : [val];
        }),
      levels: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((val) => {
          if (!val) return [];
          return Array.isArray(val) ? val : [val];
        }),
    })
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
