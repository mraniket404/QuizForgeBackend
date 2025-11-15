// controllers/userController.js
import User from "../models/User.js";
import Attempt from "../models/Attempt.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({ path: "attempts", options: { sort: { date: -1 } } })
      .populate("createdQuizzes");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// optional leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // top by streak & then highest score (simple version)
    const top = await User.find().select("name streak").sort({ streak: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
