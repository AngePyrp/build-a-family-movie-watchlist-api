import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";

export function authenticate(req, res, next) {
  const header =
    req.get?.("Authorization") ?? req.headers?.authorization;

  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}