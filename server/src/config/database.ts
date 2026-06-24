import mongoose, { type ConnectOptions } from "mongoose";
import { CONFIGS } from "../config/index.js";

const options: ConnectOptions = {
  retryWrites: true,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
} as mongoose.ConnectOptions;

export const connect = async (): Promise<void> => {
  try {
    const mongoUrl = CONFIGS.database_url as string;
    if (!mongoUrl) {
      throw new Error("<<< [MONGO_URL] is not provided! >>>");
    }

    await mongoose.connect(mongoUrl, options);
    console.log("<<< ✅ [DB] Connected Successfully ... >>>");
  } catch (error) {
    console.log("<<< ❌ [DB] Connected failed ... >>>", error);
    process.exit(1);
  }
};
