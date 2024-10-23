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

export function POST() {
  console.log("post api called");
  return NextResponse.json({
    message: "testing post",
  });
}

export function DELETE() {
  console.log("DELETE api called");
  return NextResponse.json({
    message: "testing DELETE",
  });
}
