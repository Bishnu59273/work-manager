import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { toast } from "react-toastify";

const uri = process.env.MONGO_DB_URL;

async function getNextSequenceValue(sequenceName) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const sequenceDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { returnDocument: "after", upsert: true }
      );

    return sequenceDocument.sequence_value;
  } catch (error) {
    console.error("Error in getNextSequenceValue:", error);
    throw new Error("Failed to get the next sequence value");
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const usersCollection = db.collection("users");

    const { username, email, password, role } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await getNextSequenceValue("userid");
    const objectId = new ObjectId(userId);
    const newUser = {
      _id: objectId,
      uniqueId: userId,
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify(
          { error: "User already exists" },
          toast.error("User already exists")
        ),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
