import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_DB_URL;

// Get single user
export async function GET(request, { params }) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const usersCollection = db.collection("users");

    const userID = parseInt(params.userID);

    const user = await usersCollection.findOne({
      uniqueId: userID,
    });

    // If no user is found, return a 404 error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data as JSON
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // Return a server error if something goes wrong
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    // Ensure the database connection is closed
    await client.close();
  }
}
