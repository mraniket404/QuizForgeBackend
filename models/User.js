import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  lastQuizDate: { type: String }, // store toDateString()
  profilePicture: { type: String }, // base64 encoded image
  bio: { type: String, default: "" },
  createdQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomQuiz" }],
  attempts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attempt" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);