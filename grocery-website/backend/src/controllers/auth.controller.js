import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";                // ✅ FIX
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

/* =======================
   REGISTER
======================= */
export const registerUser = async (req, res) => {
  try {
    const { name, emailOrMobile, password } = req.body;

    if (!name || !emailOrMobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ emailOrMobile });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      emailOrMobile,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =======================
   LOGIN
======================= */
export const loginUser = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const user = await User.findOne({ emailOrMobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id, user.role), // ✅ FIX
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        emailOrMobile: user.emailOrMobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================
   FORGOT PASSWORD
======================= */
export const forgotPassword = async (req, res) => {
  try {
    const { emailOrMobile } = req.body;

    const user = await User.findOne({ emailOrMobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    console.log("🔐 RESET LINK:", resetUrl);

    res.json({ message: "Reset link sent" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to send reset link" });
  }
};

/* =======================
   RESET PASSWORD
======================= */
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
