import { NotFoundError } from "@/errors";
import wordRepository from "@/repositories/word";
import libraryService from "@/services/library";

const getWord = async (word: string) => {
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
};

const getWordWithLibrary = async (word: string) => {
  const wordFromDb = await getWord(word);

  const wordSenses = await libraryService.getWord(word);

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
    ...wordFromDb,
    entries: wordFromDb.entries.map((e) => ({
      pos: e.pos,
      level: e.level,
      senses: wordSenses ? (wordSenses[e.pos] ?? []) : [],
    })),
  };

  return unionInfo;
};

export default {
  getWord,
  getWordWithLibrary,
};
