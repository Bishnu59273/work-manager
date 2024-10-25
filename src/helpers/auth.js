import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    throw new Error("Authentication token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
