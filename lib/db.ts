import mongoose from "mongoose";

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

function registerModels() {
  require("./models/User");
  require("./models/PDF");
  require("./models/Quiz");
  require("./models/Attempt");
  require("./models/WeakQuestion");
  require("./models/QuizSession");
}

async function dbConnect(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI environment variable is not defined");

  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  const cached = global._mongoose;

  if (cached.conn) {
    registerModels();
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  registerModels();
  return cached.conn;
}

export default dbConnect;
