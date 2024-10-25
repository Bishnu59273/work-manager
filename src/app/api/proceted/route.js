import { verifyToken } from "@/helpers/db";

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    // Now you can use the decoded token payload (userId, etc.)
    res.status(200).json({ message: "Protected route", userId: user.userId });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
