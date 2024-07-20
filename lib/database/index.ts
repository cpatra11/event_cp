import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: Cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  // Create a new connection promise if it doesn't exist
  cached.promise =
    cached.promise ||
    mongoose
      .connect(MONGODB_URI, {
        dbName: "evently",
        bufferCommands: false,
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        throw err;
      });

  // Await and cache the connection
  cached.conn = await cached.promise;

  return cached.conn;
};

//Server actions
// connectToDatatbase().then(() => {
