// models/CustomQuiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
  explanation: { type: String, default: "" }
});

const customQuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CustomQuiz", customQuizSchema);
