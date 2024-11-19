import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import cloudinary from "@/helpers/cloudinary";

const uri = process.env.MONGO_DB_URL;

async function getNextSequenceValue(sequenceName) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("work");
    const countersCollection = db.collection("counters");

    const sequenceDocument = await countersCollection.findOneAndUpdate(
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

    const { username, email, password, role, image } = await request.json();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "user_profiles",
      resource_type: "image",
    });

    const userId = await getNextSequenceValue("userid");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      uniqueId: userId,
      username,
      email,
      password: hashedPassword,
      role,
      image: uploadResponse.secure_url,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "Registered successfully", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
