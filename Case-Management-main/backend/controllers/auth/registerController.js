import User from "../../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, badgeId } = req.body;

    if(!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password will be hashed automatically)
    const user = new User({
      name,
      email,
      password,
      role,
      badgeId
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};