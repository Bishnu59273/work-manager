import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "work",
    });
    console.log("DB connected..");
    console.log(connection);
  } catch (err) {
    console.log("failed to connected");
    console.log(err);
  }
};
