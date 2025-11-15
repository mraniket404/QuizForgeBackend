// utils/genDailyQuiz.js
import DailyQuiz from "../models/DailyQuiz.js";

/**
 * generateDailyIfMissing(dateString)
 * creates and returns a DailyQuiz for given date if not exists
 */
export const generateDailyIfMissing = async (dateString) => {
  let existing = await DailyQuiz.findOne({ date: dateString });
  if (existing) return existing;

  // simple dummy generation — replace with smarter generation later
  const sampleQs = [];
  for (let i = 1; i <= 10; i++) {
    sampleQs.push({
      question: `Sample question ${i}: Which option is correct?`,
      options: [`Choice A${i}`, `Choice B${i}`, `Choice C${i}`, `Choice D${i}`],
      answer: i % 4 // pseudorandom
    });
  }

  const newQuiz = await DailyQuiz.create({ date: dateString, questions: sampleQs });
  return newQuiz;
};

export default generateDailyIfMissing;
