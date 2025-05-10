import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { CLIENT_URL } from "../config/config.js";
import { logger } from "../utils/logger.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { omit } from "lodash-es";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../utils/email.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      logger.error(error);
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: omit(user.toObject(), [
        "password",
        "verificationToken",
        "verificationTokenExpiresAt",
        "resetPasswordToken",
        "resetPasswordExpiresAt",
      ]),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      logger.error(error);
    }
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: omit(user.toObject(), [
        "password",
        "verificationToken",
        "verificationTokenExpiresAt",
        "resetPasswordToken",
        "resetPasswordExpiresAt",
      ]),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  logger.info("User logged in successfully");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    user.lastLogin = Date.now();
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: omit(user.toObject(), [
        "password",
        "verificationToken",
        "verificationTokenExpiresAt",
        "resetPasswordToken",
        "resetPasswordExpiresAt",
      ]),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  logger.info("User logged out successfully");
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    try {
      await sendPasswordResetEmail(
        user.email,
        `${CLIENT_URL}/reset-password/${resetToken}`
      );
    } catch (error) {
      logger.error(error);
    }
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    try {
      await sendResetSuccessEmail(user.email);
    } catch (error) {
      logger.error(error);
    }
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: omit(user.toObject(), [
        "password",
        "verificationToken",
        "verificationTokenExpiresAt",
        "resetPasswordToken",
        "resetPasswordExpiresAt",
      ]),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const userWithoutPassword = users.map((user) =>
      omit(user.toObject(), [
        "password",
        "verificationToken",
        "verificationTokenExpiresAt",
        "resetPasswordToken",
        "resetPasswordExpiresAt",
      ])
    );
    res.status(200).json({ success: true, users: userWithoutPassword });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
