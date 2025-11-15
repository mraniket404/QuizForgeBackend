import User from "../models/User.js";
import Attempt from "../models/Attempt.js";

export const getProfile = async (req, res) => {
  try {
    console.log("🔍 Fetching profile for user ID:", req.userId);
    
    if (!req.userId) {
      console.log("❌ No user ID in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.userId)
      .populate("attempts")
      .select("-password");
    
    console.log("📊 Found user:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ Sending user data");
    res.json(user);
  } catch (err) {
    console.error("💥 Error in getProfile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("🔄 Updating profile for user:", req.userId);
    console.log("📝 Update data:", req.body);
    
    const { name, email, bio, profilePicture } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("💥 Error in updateProfile:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.userId }).sort({ date: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name streak profilePicture")
      .sort({ streak: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};