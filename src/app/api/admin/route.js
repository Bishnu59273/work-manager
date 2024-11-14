import { MongoClient } from "mongodb";
import { authenticateToken } from "@/helpers/authenticateToken";

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  await client.connect();
  return client.db("work");
}

export async function GET(request) {
  const user = await authenticateToken(request, "admin");
  if (!user) return;

  try {
    const database = await connectToDatabase();
    const usersCollection = database.collection("users");

    const admin = await usersCollection.find({ role: "admin" }).toArray();

    return new Response(
      JSON.stringify({
        message: "Admin data retrieved successfully",
        data: admin,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
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
