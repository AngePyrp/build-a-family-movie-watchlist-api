import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../utils/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const user = findByUsername(username.trim());
  const validPassword = user?.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : false;
  if (!user || !validPassword) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );
  return res.status(200).json({ token });
});

export default router;