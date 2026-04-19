import { userWordRepository } from "@/repositories/userWord";
import {
  CreateUserWordInput,
  GetUserWordInput,
  UpdateUserWordInput,
} from "@/schemas/validators/userWord";

import { BadRequestError, NotFoundError } from "@/errors";

export const userWordService = {
  async create(user_id: string, data: CreateUserWordInput) {
    await userWordRepository.create(user_id, data);
  },

  async update(user_id: string, word_id: number, data: UpdateUserWordInput) {
    const howManyFields = Object.keys(data).length;

    if (howManyFields === 0) {
      throw new BadRequestError(
        "At least one field must be provided to update!",
        "NO_UPDATE_FIELDS_PROVIDED",
      );
    }

    const res = await userWordRepository.update(user_id, word_id, data);

    if (!res) {
      throw new NotFoundError(
        "Word not found in your words!",
        "USER_WORD_NOT_FOUND",
      );
    }

    return res;
  },

  async delete(user_id: string, word_id: number) {
    const res = await userWordRepository.delete(user_id, word_id);

    if (!res) {
      throw new NotFoundError(
        "Word not found in your words!",
        "USER_WORD_NOT_FOUND",
      );
    }

    return res;
  },
  async getUsersWord(user_id: string, word_id: number) {
    return await userWordRepository.getByUserIdAndWordId(user_id, word_id);
  },

  async getUsersWords(user_id: string, filters: GetUserWordInput) {
    const LIMIT = 50;
    const offset = filters.offset ? filters.offset : 0;

    // Ensure offset is always a multiple of 50 to keep pagination consistent
    const safeOffset = Math.floor(offset / LIMIT) * LIMIT;

    const response = await userWordRepository.getByUserId(user_id, filters, {
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
};
