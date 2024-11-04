import { MongoClient } from "mongodb";
import { authenticateToken } from "@/helpers/authenticateToken";

const uri = process.env.MONGO_DB_URL; // MongoDB connection string
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  await client.connect();
  return client.db("work"); // Your database name
}

export async function GET(request) {
  const user = await authenticateToken(request, "radiologist");
  if (!user) return; // Unauthorized response handled in authenticateToken

  try {
    const database = await connectToDatabase();
    const usersCollection = database.collection("users");

    // Fetch all users with the radiologist role
    const normal_user = await usersCollection
      .find({ role: "normal_user" })
      .toArray();

    return new Response(
      JSON.stringify({
        message: "Radiologists data retrieved successfully",
        data: normal_user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to fetch normal_user data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch radiologists data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await client.close();
  }
}
