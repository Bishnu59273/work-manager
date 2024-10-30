import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URL;
const key = process.env.JWT_SECRET;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("work");
  }
  return db;
}

export async function POST(request) {
  try {
    const database = await connectToDatabase();

    // Parse request body
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user by email
    const user = await database.collection("users").findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the selected role matches the user's role in the database
    if (user.role !== role) {
      return new Response(
        JSON.stringify({ error: "Invalid role for this user" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        username: user.username,
        email: user.email,
      },
      key,
      {
        expiresIn: "1h",
      }
    );

    console.log("Token generated:", token);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal server error:", error.message);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
