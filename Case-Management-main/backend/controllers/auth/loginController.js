import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and profile role are required" });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify correct role profile
    if (user.role !== role) {
      return res.status(403).json({ message: `Access denied. Account is registered as ${user.role}, not ${role}.` });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email
        // add any other fields you want to show on the frontend
      }
    });

  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};