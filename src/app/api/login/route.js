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
    const { email, password, role, image } = await request.json();

    // Check if email and password are provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch user from the database
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

    // Check if the role matches
    if (user.role !== role) {
      return new Response(
        JSON.stringify({ error: "Invalid role for this user" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // If image is provided, upload it to Cloudinary and get the URL
    let uploadedImage = user.image;

    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "user_profiles",
        });
        uploadedImage = cloudinaryResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Error uploading image to Cloudinary:", cloudinaryError);
        return new Response(JSON.stringify({ error: "Image upload failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        username: user.username,
        email: user.email,
        image: uploadedImage,
      },
      key,
      {
        expiresIn: "1h",
      }
    );

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
