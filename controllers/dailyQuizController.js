// controllers/dailyQuizController.js
import DailyQuiz from "../models/DailyQuiz.js";
import Attempt from "../models/Attempt.js";
import User from "../models/User.js";
import { generateDailyIfMissing } from "../utils/genDailyQuiz.js";

export const getToday = async (req, res) => {
  try {
    const today = new Date().toDateString();
    let quiz = await DailyQuiz.findOne({ date: today });
    if (!quiz) {
      // generate and save a quiz when missing
      quiz = await generateDailyIfMissing(today);
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitDaily = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const user = req.user;
    const quiz = await DailyQuiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers && answers[i] !== null && answers[i] === q.answer) score += 1;
    });

    // create Attempt snapshot
    const attempt = await Attempt.create({
      userId: user._id,
      quizId: quiz._id,
      quizModel: "DailyQuiz",
      score,
      answers,
      type: "daily",
      questions: quiz.questions
    });

    // update user streak logic
    const today = new Date().toDateString();
    if (user.lastQuizDate === today) {
      // already done today, don't double count
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (user.lastQuizDate === yesterday) user.streak = (user.streak || 0) + 1;
      else user.streak = 1;
      user.lastQuizDate = today;
      user.attempts.push(attempt._id);
      await user.save();
    }

    res.json({ attemptId: attempt._id, score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
