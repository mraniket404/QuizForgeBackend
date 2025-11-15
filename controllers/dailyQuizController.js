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
    console.log("📝 Submitting daily quiz for user:", req.userId);
    console.log("📊 Submission data:", req.body);

    const { quizId, answers } = req.body;
    
    if (!quizId || !answers) {
      return res.status(400).json({ message: "Quiz ID and answers are required" });
    }

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const quiz = await DailyQuiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers && answers[i] !== null && answers[i] === q.answer) score += 1;
    });

    console.log("🎯 Score calculated:", score, "/", quiz.questions.length);

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

    console.log("💾 Attempt created:", attempt._id);

    // update user streak logic
    const today = new Date().toDateString();
    if (user.lastQuizDate === today) {
      // already done today, don't double count
      console.log("ℹ️ User already played today");
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (user.lastQuizDate === yesterday) {
        user.streak = (user.streak || 0) + 1;
        console.log("🔥 Streak increased to:", user.streak);
      } else {
        user.streak = 1;
        console.log("🆕 New streak started:", user.streak);
      }
      user.lastQuizDate = today;
      user.attempts.push(attempt._id);
      await user.save();
      console.log("👤 User updated with new streak and attempt");
    }

    res.json({ 
      success: true,
      attemptId: attempt._id, 
      score,
      total: quiz.questions.length
    });
    
  } catch (err) {
    console.error("💥 Error in submitDaily:", err);
    console.error("📋 Error details:", err.message);
    res.status(500).json({ message: "Error submitting quiz: " + err.message });
  }
};