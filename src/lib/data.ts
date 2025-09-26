import mongoose, { Mongoose } from "mongoose";

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("Falta la variable de entorno: MONGO_URI");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      dbName: "Organizaya",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
