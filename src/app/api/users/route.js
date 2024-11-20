import { NextResponse } from "next/server";
// import { ConnectDB } from "@/helpers/db";
import { MongoClient } from "mongodb";
import { jwtDecode } from "jwt-decode";

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // Get the email query parameter (if provided)

    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("users");

    let result;

    if (email) {
      result = await usersCollection.findOne({ email });

      if (!result) {
        return new NextResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      result = { message: "User data retrieved successfully", user: result };
    } else {
      const users = await usersCollection.find({}).toArray();
      result = { message: "All users retrieved successfully", users };
    }

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export async function PUT(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authorization token is required" }),
        { status: 401 }
      );
    }

    console.log("Token received:", token);

    const decodedToken = jwtDecode(token);
    const userEmail = decodedToken?.email;
    console.log("Decoded token email:", userEmail);

    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token or email not found" }),
        { status: 400 }
      );
    }

    const updatedData = await request.json();
    console.log("Updated data:", updatedData);

    // Check for invalid data before performing update
    if (!updatedData.username || !updatedData.email) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields (username or email)",
        }),
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ email: userEmail });
    console.log("User found:", user);

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const result = await usersCollection.updateOne(
      { email: userEmail },
      {
        $set: updatedData,
      }
    );
    console.log("Update result:", result);

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      console.error("No changes made to the document");
      return new NextResponse(
        JSON.stringify({ error: "No changes made to the user data" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User details updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during update operation:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update user data" }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
