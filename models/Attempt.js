// models/Attempt.js
import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, refPath: "quizModel" }, // DailyQuiz or CustomQuiz id
  quizModel: { type: String, enum: ["DailyQuiz", "CustomQuiz"] },
  score: Number,
  answers: [Number],
  type: { type: String, enum: ["daily", "custom"] },
  date: { type: Date, default: Date.now },
  questions: { type: Array } // snapshot of questions (to show on result)
});

export default mongoose.model("Attempt", attemptSchema);
