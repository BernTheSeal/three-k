import { NotFoundError } from "@/errors";
import { wordRepository } from "@/repositories/word";
import { libraryService } from "@/services/library";
import { userWordService } from "./userWord";
import { GetWordsInput } from "@/schemas/validators/word";

export const wordService = {
  async getAll(filters: GetWordsInput) {
    const LIMIT = 50;
    const offset = filters.offset ? filters.offset : 0;

    // Ensure offset is always a multiple of LIMIT to keep pagination consistent
    const safeOffset = Math.floor(offset / LIMIT) * LIMIT;

    const response = await wordRepository.getAll(filters, {
      limit: LIMIT,
      offset: safeOffset,
    });

    const totalCount = response.length > 0 ? response[0].total_words : 0;

    const hasMore = totalCount > safeOffset + LIMIT;

    // Remove the helper 'total_words' column from each row before returning
    const cleanedWords = response
      .slice(0, LIMIT)
      .map(({ total_words, ...rest }) => rest);

    const nextOffset = safeOffset + LIMIT;

    return {
      paginate: { hasMore, nextOffset },
      totalCount: totalCount,
      words: cleanedWords,
    };
  },

  async getByWord(word: string) {
    const rows = await wordRepository.getByWord(word);

    if (rows.length === 0) {
      throw new NotFoundError(`${word} is not found!`, "WORD_NOT_FOUND");
    }

    const firstRow = rows[0];

    const formattedData = {
      word_id: firstRow.word_id,
      word: firstRow.word,
      phonetics: [
        ...new Map(
          rows.map((r) => [
            r.locale,
            {
              locale: r.locale,
              text: r.text,
              mp3: r.mp3,
            },
          ]),
        ).values(),
      ],
      entries: [
        ...new Map(
          rows.map((r) => [r.pos, { pos: r.pos, level: r.level }]),
        ).values(),
      ],
    };

    return formattedData;
  },

  async getWordWithLibrary(user_id: string, word: string) {
    const wordFromDb = await this.getByWord(word);

    const wordSenses = await libraryService.getDefAndExample(word);

    const userWordInfo = await userWordService.getUsersWord(
      user_id,
      wordFromDb.word_id,
    );

    if (wordSenses) {
      const dbPosList = wordFromDb.entries.map((e) => e.pos);
      const apiPosList = Object.keys(wordSenses);

      const missingPos = apiPosList.filter((pos) => !dbPosList.includes(pos));

      if (missingPos.length > 0) {
        console.warn(
          `[MISSING_POS] ::: word="${word}" missing_pos=${missingPos.join(",")}`,
        );
      }
    }

    const unionInfo = {
      userInfo: userWordInfo,
      ...wordFromDb,
      entries: wordFromDb.entries.map((e) => ({
        pos: e.pos,
        level: e.level,
        senses: wordSenses ? (wordSenses[e.pos] ?? []) : [],
      })),
    };

    return unionInfo;
  },
};
