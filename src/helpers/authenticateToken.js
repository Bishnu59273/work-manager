import jwt from "jsonwebtoken";

const key = process.env.JWT_SECRET;

export async function authenticateToken(request, requiredRole = null) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Token not provided" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decoded = jwt.verify(token, key);

    // Check if a specific role is required
    if (requiredRole && decoded.role !== requiredRole) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return decoded; // Proceed with the user's decoded information (e.g., userId, role)
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
}
