// models/DailyQuiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
  explanation: { type: String, default: "" }
});

const dailyQuizSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  questions: [questionSchema]
});

export default mongoose.model("DailyQuiz", dailyQuizSchema);
