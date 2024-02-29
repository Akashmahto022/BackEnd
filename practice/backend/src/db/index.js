import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`mongoDB connected || and host it , ${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("there is an error with connecting mongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB
