import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded token user ID:", decoded.id);
      
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log("❌ User not found for token");
        return res.status(401).json({ message: "User not found" });
      }
      
      req.userId = user._id;
      console.log("✅ Authentication successful for user:", user._id);
      next();
    } catch (error) {
      console.error("💥 Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.error("💥 Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};