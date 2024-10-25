import { NextResponse } from "next/server";
import { ConnectDB } from "@/helpers/db";
import { MongoClient } from "mongodb";

// ConnectDB();
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);

export async function GET(request) {
  try {
    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("contact");

    const users = await usersCollection.find({}).toArray();
    console.log(users);

    return new Response(JSON.stringify(users), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch user data:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch user data" }),
      {
        status: 500,
      }
    );
  } finally {
    await client.close();
  }
}
export async function POST(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const usersCollection = db.collection("contact");

    const { name, message } = await request.json();

    const newUser = {
      // _id: nextId,
      name,
      message,
      createdAt: new Date(),
    };

    // Insert the new user
    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred during POST:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export function DELETE() {
  console.log("DELETE api called");
  return NextResponse.json({
    message: "testing DELETE",
  });
}
