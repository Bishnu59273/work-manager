import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { jwtDecode } from "jwt-decode";
import cloudinary from "@/helpers/cloudinary";

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // Get the email query parameter (if provided)
    const page = parseInt(searchParams.get("page") || "1", 10); // Get the page query parameter (default to 1)
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Get the limit query parameter (default to 10)

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid pagination parameters" }),
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db("work");
    const usersCollection = database.collection("users");

    let result;

    if (email) {
      // Fetch a single user by email
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return new NextResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      result = { message: "User data retrieved successfully", user };
    } else {
      // Pagination logic
      const totalUsers = await usersCollection.countDocuments(); // Get total number of users
      const totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

      if (page > totalPages) {
        return new NextResponse(
          JSON.stringify({ error: "Page number out of range" }),
          { status: 400 }
        );
      }

      const users = await usersCollection
        .find({})
        .skip((page - 1) * limit) // Skip documents for previous pages
        .limit(limit) // Limit documents for the current page
        .toArray();

      result = {
        message: "Users retrieved successfully",
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
        users,
      };
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

    const decodedToken = jwtDecode(token);
    const userEmail = decodedToken?.email;

    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token or email not found" }),
        { status: 400 }
      );
    }

    const updatedData = await request.json();

    // Validate required fields
    if (!updatedData.username || !updatedData.email) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields (username or email)",
        }),
        { status: 400 }
      );
    }

    // Image handling
    let imageUrl = updatedData.image;
    if (imageUrl.startsWith("data:image")) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(imageUrl, {
          upload_preset: "new_images",
        });
        imageUrl = cloudinaryResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return new NextResponse(
          JSON.stringify({ error: "Error uploading image to Cloudinary" }),
          { status: 500 }
        );
      }
    }

    // Connect to database
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
        $set: {
          username: updatedData.username,
          email: updatedData.email,
          image: imageUrl,
        },
      }
    );

    if (result.modifiedCount === 0) {
      console.log("No changes made to the document");
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
