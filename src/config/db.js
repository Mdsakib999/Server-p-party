import mongoose from "mongoose";
import { envVariables } from "./envVariables.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envVariables.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
