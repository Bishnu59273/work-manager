// pages/api/login.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import dbConnect from "@/helpers/db";

export default async function handler(req, res) {
  await dbConnect();

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Check if password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Return token
  res.status(200).json({ token });
}
