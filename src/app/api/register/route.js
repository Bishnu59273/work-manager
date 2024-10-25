import { NextResponse } from "next/server";
import { ConnectDB } from "@/helpers/db";
import { MongoClient } from "mongodb";

// ConnectDB();
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);

// auto-increment
async function getNextSequenceValue(sequenceName) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("work");
    const sequencesCollection = db.collection("sequences");

    const sequenceDocument = await sequencesCollection.findOneAndUpdate(
      { _id: sequenceName }, // Look for the document with _id as sequenceName (e.g., 'userId')
      { $inc: { sequenceValue: 1 } }, // Increment sequenceValue by 1
      {
        returnDocument: "after", // Return the updated document
        upsert: true, // Create the document if it doesn't exist
      }
    );

    console.log("Sequence Document:", sequenceDocument);
    // If the document doesn't have a value yet, set the initial sequence value to 1
    if (!sequenceDocument.value) {
      await sequencesCollection.updateOne(
        { _id: sequenceName },
        { $set: { sequenceValue: 1 } }
      );
      return 1; // Return 1 as the first sequence value
    }
    // Return the incremented sequence value
    return sequenceDocument.value.sequenceValue;
  } finally {
    await client.close();
  }
}

export async function GET(request) {
  try {
    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("users");

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
// export function GET(request) {
//   const users = [
//     {
//       name: "bishnu",
//       id: 1,
//       course: "MCA",
//     },
//     {
//       name: "krishna",
//       id: 2,
//       course: "MCA",
//     },
//     {
//       name: "shibam",
//       id: 3,
//       course: "MCA",
//     },
//     {
//       name: "taskin",
//       id: 4,
//       course: "MCA",
//     },
//   ];
//   return NextResponse.json(users);
// }

export async function POST(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const usersCollection = db.collection("users");

    const { name, message } = await request.json();

    // Get the next sequence value for user IDs
    // const nextId = await getNextSequenceValue("userId");

    // Prepare new user data
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
