import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

/**
 * GET /api/users/profile
 */
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not authenticated" });
    }

    res.json({
      name: req.user.name,
      emailOrMobile: req.user.emailOrMobile,
      role: req.user.role,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch profile" });
  }
};

/**
 * PUT /api/users/profile
 */
export const updateMyProfile = async (req, res) => {
  const { name, emailOrMobile, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (emailOrMobile) user.emailOrMobile = emailOrMobile;

    // Update password (optional)
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        emailOrMobile: user.emailOrMobile,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res
      .status(500)
      .json({ message: "Profile update failed" });
  }
};
