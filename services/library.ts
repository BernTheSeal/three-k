import axios from "axios";
import { format } from "path";
import z from "zod";

const WordResponseSchema = z.object({
  entries: z.array(
    z.object({
      partOfSpeech: z.string(),
      senses: z.array(
        z.object({
          definition: z.string(),
          examples: z.array(z.string()),
        }),
      ),
    }),
  ),
});

export const libraryService = {
  async getDefAndExample(word: string) {
    try {
      const res = await axios.get(
        `https://freedictionaryapi.com/api/v1/entries/en/${word}`,
        { timeout: 10000 },
      );

      const result = WordResponseSchema.safeParse(res.data);

      if (!result.success || result.data.entries.length === 0) {
        return null;
      }

      const formattedData = result.data.entries.reduce(
        (
          acc: Record<string, { definition: string; examples: string[] }[]>,
          d,
        ) => {
          const senses = d.senses.map((s) => ({
            definition: s.definition,
            examples: s.examples,
          }));

          acc[d.partOfSpeech] = [
            ...(acc[d.partOfSpeech] || []),
            ...senses,
          ].sort((a, b) => b.examples.length - a.examples.length);

          return acc;
        },
        {},
      );

      return formattedData;
    } catch (error) {
      return null;
    }
  },
};
