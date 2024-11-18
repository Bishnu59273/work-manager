import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

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
    console.error("Failed to fetch contact data:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch conatct data" }),
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

    const { username, email, phone, message } = await request.json();

    const ContactMessage = {
      username,
      email,
      phone,
      message,
      SendAt: new Date(),
    };

    const result = await usersCollection.insertOne(ContactMessage);

    return NextResponse.json({ status: 201 });
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
