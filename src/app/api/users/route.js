import { NextResponse } from "next/server";
// import { ConnectDB } from "@/helpers/db";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
export async function GET(request) {
  try {
    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("users");

    const users = await usersCollection.find({}).toArray();

    return new Response(
      JSON.stringify({
        message: "AllUsers data retrieved successfully",
        users,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch user data:", error);

    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await client.close();
  }
}
